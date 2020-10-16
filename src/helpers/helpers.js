export const debounce = function(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const shuffledArray = function(array) {
  const copy = [ ...array ];
  const total = copy.length -1;

  for(let i = total; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }

  return copy;
}
