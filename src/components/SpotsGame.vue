<template>
  <div id="spots-game" />
</template>

<script>
import * as d3 from "d3";
//import {select} from 'd3-selection'

export default {
  name: 'SpotsGame',

  data() {
    return {
      maxRadius: 100,
      simulation: null,
      spots: [],
      stageWidth: 800,
      stageHeight: 500,
      starterRadius: 40,
      stage: null,
      svg: null
    }
  },

  watch: {
    spots() {
      this.updateSpots();
    }
  },

  mounted() {
    console.log('d3', d3);
    this.setStage();
    this.setFilters();
    this.setListeners();
  },

  methods: {
    avoidCollisions() {
      const nodes = this.spots.map(Object.create);

      function ticked() {
        console.log('ticked whatever that means');
      }

      this.simulation = d3.forceSimulation(nodes)
        .alphaTarget(0.3) // stay hot
        .velocityDecay(0.1) // low friction
        .force("x", d3.forceX().strength(0.01))
        .force("y", d3.forceY().strength(0.01))
        .force("collide", d3.forceCollide().radius(d => d.r + 1).iterations(3))
        .force("charge", d3.forceManyBody())

      this.simulation
        .on("tick", ticked);

      this.simulation.stop();
    },

    changeColor() {
      console.log('change color');
    },

    createSpot(xVal, yVal) {
      console.log('create spot');
      const spot = {
        x: xVal,
        y: yVal,
        r: this.starterRadius,
        color: this.randomColor()
      }
      this.spots = this.spots.concat([spot]);
      console.log('spots', this.spots);
    },

    updateSpots() {
      this.stage
        .selectAll('circle')
        .data(this.spots)
        .join('circle')
          .attr('class', 'spot')
          .attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y)
          .attr('fill', (d) => d.color)
          .attr("filter", "url(#drop-shadow)")
        .transition()
          .duration(400)
          .ease(d3.easeCubicOut)
          .attr('r', (d) => d.r)
    },

    randomColor() {
      return d3.interpolateWarm(Math.random());
    },

    removeSpot() {
      console.log('remove spot');
    },

    growSpot() {
      console.log('grow spot');
    },

    onSvgMouseDown(ev) {
      console.log('onmousedown ev', ev);
      ev.preventDefault();
      this.createSpot(ev.offsetX, ev.offsetY);
      //const currSpot = this.spots[this.spots.length - 1];

      // while(growing && currSpot.r < this.maxRadius) {
      //   currSpot.r++;
      // }

    },

    setFilters() {
      // Svg filter
      const defs = this.svg.append("defs");

      const filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "200%");

      filter.append("feDropShadow")
        .attr("dx", -2)
        .attr("dy", 8)
        .attr('stdDeviation', 6);
        // .attr('floodColor', this.randomColor())
        // .attr('floodOpacity', 1);
    },

    setListeners() {
      this.svg.on('mousedown', this.onSvgMouseDown);
        // .on("touchmove", event => event.preventDefault())
        // .on("pointermove", pointed);
    },

    setStage() {
      console.log('set stage');
      this.svg = d3.select('#spots-game')
        .append('svg')
        .attr('class', 'spots-svg')
        .attr('width', this.stageWidth)
        .attr('height', this.stageHeight);

      this.stage = this.svg
        .append('g')
        .attr('class', 'spots-stage');

      // Sample spots
      this.createSpot(20, 20);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spots-stage {
  border: 1px solid #ddd;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
