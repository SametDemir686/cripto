
====== How to run =======
The source file can be found in src folder. 

To run the animation code, open src/index.html in a browser.

To run the experiment code, open src/sketch.gs and change line 8 as follows.
	let experiment = true;
And save the file. Then open src/index.html in a browser and see the output in browser console.

====== How to use =======
When the program opens first time, it starts with a random pointset and starts executing QuickHull algorithm by default.
The user can:
	upload their points by using upload button.
	can create new point sets by selecting the point set type and the point set size and by clicking the create button.
	change the color by using the color input buttons.
	change the algorithm from the checkbox on the top and run them by clicking apply button.
	pause reset and contiune the algorithms by the top left buttons.
	set the frame rate form the top right slidebar.
	add points by clicking on the canvas
	close the "clicking to add point" feature with the checkbox.
	save the current points by the save button on the right bottom.