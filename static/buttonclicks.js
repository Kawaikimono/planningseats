
// nchart = document.getElementById("nchart").addEventListener("click", displayNewPage);

// subseat = document.getElementById("subseat").addEventListener("click", displaySeatChart);

// createSeatting(){
//     tables = document.getElementById("tables").value
//     seats = document.getElementById("seats").value
//     guests = document.getElementById("guests").value
// }


/* Made with love by @fitri
 This is a component of my ReactJS project
https://www.codehim.com/vanilla-javascript/javascript-drag-and-drop-reorder-list */

// function enableDragSort(listClass) {
//     const sortableLists = document.getElementsByClassName(listClass);
//     Array.prototype.map.call(sortableLists, (list) => {enableDragList(list)});
//   }
  
//   function enableDragList(list) {
//     Array.prototype.map.call(list.children, (item) => {enableDragItem(item)});
//   }
  
//   function enableDragItem(item) {
//     item.setAttribute('draggable', true)
//     item.ondrag = handleDrag;
//     item.ondragend = handleDrop;
//   }
  
//   function handleDrag(item) {
//     const selectedItem = item.target,
//           list = selectedItem.parentNode,
//           x = event.clientX,
//           y = event.clientY;
    
//     selectedItem.classList.add('drag-sort-active');
//     let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);
    
//     if (list === swapItem.parentNode) {
//       swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
//       list.insertBefore(selectedItem, swapItem);
//     }
//   }
  
//   function handleDrop(item) {
//     item.target.classList.remove('drag-sort-active');
//   }
  
//   (()=> {enableDragSort('drag-sort-enable')})();