<template>
  <div>
    <div class="">
      <button
        @click="newEasyGame">
        New Easy Game
      </button>
      <button
        @click="newHardGame">
        New Hard Game
      </button>
    </div>
    <div id="spots-game" />
    <div class="matched-spots">
      <h2>Matched</h2>
      <ol class="match-list">
        <li
          v-for="(match, i) in matched"
          :key="i">
          {{ match.emoji }} {{ match.emoji }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { emojis } from '../data/emojis.js';
import { debounce, shuffledArray } from '../helpers/helpers.js';

export default {
  name: 'SpotsGame',

  data() {
    return {
      activeSymbols: [],
      difficulty: 'easy',
      matched: [],
      simulation: null,
      spotRadius: 40,
      spots: [],
      stageWidth: 800,
      stageWidthDefault: 800,
      stageHeight: 500,
      stage: null,
      svg: null
    }
  },

  computed: {
    maxXPos() {
      return this.stageWidth - this.spotRadius;
    },

    maxYPos() {
      return this.stageHeight - this.spotRadius;
    },

    spotsLimit() {
      // Even numbers only!
      return this.difficulty === 'easy' ? 18 : 46;
    },

    symbolSize() {
      return this.spotRadius * 1.5;
    }
  },

  watch: {
    spots() {
      this.drawSpots();
    }
  },

  mounted() {
    this.debouncedResize = debounce(this.onScreenResize, 300);
    window.addEventListener("resize", this.debouncedResize, { passive: true });
    this.setStage();
    this.setSvgFilters();
    this.setSpotsData();
  },

  methods: {
    createSpot(emoji, x, y) {
      if(emoji === undefined || emoji === '') {
        return;
      }

      const xVal = x || this.randomXVal();
      const yVal = y || this.randomYVal();
      const spot = {
        x: xVal,
        y: yVal,
        r: this.spotRadius,
        color: this.randomColor(),
        emoji: emoji
      }
      return spot;
    },

    drawSpots() {
      const exitTransition = this.svg.transition()
        .duration(700);

      this.stage
        .selectAll('.spot')
        .data(this.spots)
        .join(
          (enter) => {
            const group = enter.append('g')
              .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
              .attr('class', 'spot')
              .on('mouseup', this.onSpotClick);

            group
              .append('circle')
                .attr('class', 'spot-circle')
                .attr('fill', (d) => d.color)
                .attr('filter', 'url(#drop-shadow)')
              .transition()
              .delay((d, i) => (i / this.spots.length * 1500))
              .duration(400)
              .ease(d3.easeCubicOut)
                .attr('r', (d) => d.r);

            group
              .append('text')
              .attr('class', 'spot-symbol')
              .attr('opacity', 0)
              .attr('text-anchor', 'middle')
              .attr('dominant-baseline', 'middle')
              .attr('dy', this.spotRadius * 0.2)
              .attr('font-size', this.symbolSize)
              .text((d) => d.emoji);
          },

          (update) => {
            update
              .transition()
              .delay(200)
              .duration(400)
              .ease(d3.easeCubicOut)
              .attr('transform', (d) => `translate(${d.x}, ${d.y})`);

            update
              .select('circle')
                .attr('fill', (d) => d.color);

            update
              .select('text')
                .text((d) => d.emoji);
          },

          (exit) => {
            exit
              .call(exit => exit.transition(exitTransition)
              .attr('transform', (d) => `translate(${d.x}, ${d.y - 25})`)
              .remove());
          }
       );
    },

    deselectAll() {
      this.activeSymbols.forEach((item) => item.classList.remove('selected'));
      this.activeSymbols = [];
    },

    flipUp(spot) {
      this.activeSymbols = this.activeSymbols.concat([spot]);
      d3.select(spot).raise();
      spot.classList.add('selected');
    },

    handleMatch(spotData) {
      this.matched = this.matched.concat([spotData]);
      this.activeSymbols = [];
      this.spots = this.spots.filter(spot => spot.emoji !== spotData.emoji);
    },

    newEasyGame() {
      this.difficulty = 'easy';
      this.newGame();
    },

    newHardGame() {
      this.difficulty = 'hard';
      this.newGame();
    },

    newGame() {
      this.matched = [];
      this.deselectAll();
      this.setSpotsData();
    },

    onScreenResize() {
      this.deselectAll();
      this.setStageDims();
      this.repositionSpots();
    },

    onSpotClick(ev) {
      const spot = ev.target.closest('g');

      if(spot.classList.contains('selected')) {
        return;
      }

      if(this.activeSymbols.length === 2) {
        this.deselectAll();
      }

      this.flipUp(spot);

      if (this.activeSymbols.length === 2) {
        // check for match
        if(this.activeSymbols[0].__data__.emoji === this.activeSymbols[1].__data__.emoji) {
          this.handleMatch(spot.__data__);
        }
      }
    },

    randomColor() {
      return d3.interpolateWarm(Math.random());
    },

    randomXVal() {
      return Math.random() * (this.maxXPos - this.spotRadius) + this.spotRadius;
    },

    randomYVal() {
      return Math.random() * (this.maxYPos - this.spotRadius) + this.spotRadius;
    },

    repositionSpots() {
      this.spots = this.spots.map((spot) => {
        return { ...spot, x: this.randomXVal(), y: this.randomYVal() };
      });
    },

    setStageDims() {
      this.stageWidth = window.innerWidth < this.stageWidthDefault ? window.innerWidth : this.stageWidthDefault;
      this.svg
        .attr('width', this.stageWidth)
        .attr('height', this.stageHeight);
    },

    setSvgFilters() {
      // Svg filter
      const defs = this.svg.append("defs");

      const filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "150%");

      filter.append("feDropShadow")
        .attr("dx", -1)
        .attr("dy", 1)
        .attr('stdDeviation', 1)
        .attr('flood-color', '#333');
    },

    setSpotsData() {
      // Sample spots
      const symbols = shuffledArray(emojis).slice(0, (this.spotsLimit / 2));
      const emojiList = shuffledArray(symbols.concat(symbols));
      const spots = [];

      let i = this.spotsLimit - 1;
      while(i > -1) {
        const symbol = emojiList[i].symbol;
        spots.push(this.createSpot(symbol));
        i--;
      }

      this.spots = spots;
    },

    setStage() {
      this.svg = d3.select('#spots-game')
        .append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('class', 'spots-svg');

      this.setStageDims();

      this.stage = this.svg
        .append('g')
        .attr('class', 'spots-stage');
    }
  }
}
</script>

<style>
.spot {
  cursor: pointer;
}

.spot.selected .spot-symbol {
  opacity: 1;
}

.match-list {
  max-width: 500px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
  column-count: 3;
}

.match-list li {
  font-size: 40px;
}
</style>
