#target "illustrator"

// Set the document units to millimeters and resolution to 300 ppi
app.activeDocument.rulerOrigin = [0, 0];
app.activeDocument.rulerUnits = RulerUnits.Millimeters;
app.activeDocument.resolution = 300;

// Get the selected object
var selectedObject = app.activeDocument.selection[0];

// Check if "Dimensions" layer exists, if not, create it
var layer;
try {
    layer = app.activeDocument.layers.getByName("Dimensions");
} catch (e) {
    layer = app.activeDocument.layers.add();
    layer.name = "Dimensions";
}

// Create a new group for all the dimension elements
var dimensionGroup = layer.groupItems.add();

// Function to create a triangle (arrow) at given coordinates and orientation
function createTriangle(group, x, y, direction) {
    var sizeX = 1 * 2.834645669; // Triangle width (1 mm)
    var sizeY = 2 * 2.834645669; // Triangle height (2 mm)

    // Define the triangle points based on direction (up, down, left, right)
    var points;
    switch (direction) {
        case "up":
            points = [[x - sizeX / 2, y - sizeY], [x + sizeX / 2, y - sizeY], [x, y]];
            break;
        case "down":
            points = [[x - sizeX / 2, y + sizeY], [x + sizeX / 2, y + sizeY], [x, y]];
            break;
        case "left":
            points = [[x + sizeY, y + sizeX / 2], [x + sizeY, y - sizeX / 2], [x, y]];
            break;
        case "right":
            points = [[x - sizeY, y + sizeX / 2], [x - sizeY, y - sizeX / 2], [x, y]];
            break;
    }

    // Set the triangle path
    var triangle = group.pathItems.add();
    triangle.setEntirePath(points);
    triangle.closed = true;
    triangle.filled = true;
    triangle.fillColor = app.activeDocument.swatches[3].color;
    triangle.stroked = false;
}

// Add the width dimension line (shortened by 0.5 mm on both sides)
var widthLine = dimensionGroup.pathItems.add();
var leftPoint = selectedObject.left + 0.5* 2.834645669; // Shift right by 0.5 mm
var rightPoint = selectedObject.left + selectedObject.width - 0.5* 2.834645669; // Shift left by 0.5 mm
widthLine.setEntirePath([
  [leftPoint, selectedObject.top + 10],
  [rightPoint, selectedObject.top + 10]
]);
widthLine.filled = false;
widthLine.stroked = true;
widthLine.strokeWidth = 0.6;
widthLine.strokeColor = app.activeDocument.swatches[3].color;

// Add the height dimension line (shortened by 0.5 mm on both sides)
var heightLine = dimensionGroup.pathItems.add();
var topPoint = selectedObject.top - 0.5* 2.834645669; // Shift down by 0.5 mm
var bottomPoint = selectedObject.top - selectedObject.height + 0.5* 2.834645669; // Shift up by 0.5 mm
heightLine.setEntirePath([
  [selectedObject.left - 10, topPoint],
  [selectedObject.left - 10, bottomPoint]
]);
heightLine.filled = false;
heightLine.stroked = true;
heightLine.strokeWidth = 0.6;
heightLine.strokeColor = app.activeDocument.swatches[3].color;

// Add triangles (arrows) to the ends of the dimension lines
createTriangle(dimensionGroup, selectedObject.left, selectedObject.top + 10, "left"); // Left for width
createTriangle(dimensionGroup, selectedObject.left + selectedObject.width, selectedObject.top + 10, "right"); // Right for width
createTriangle(dimensionGroup, selectedObject.left - 10, selectedObject.top, "up"); // Up for height
createTriangle(dimensionGroup, selectedObject.left - 10, selectedObject.top - selectedObject.height, "down"); // Down for height

// Add the width dimension left support line
var widthLineSupportLeft = dimensionGroup.pathItems.add();
widthLineSupportLeft.setEntirePath([
  [selectedObject.left, selectedObject.top + 20],
  [selectedObject.left, selectedObject.top - 20]
]);
widthLineSupportLeft.filled = false;
widthLineSupportLeft.stroked = true;
widthLineSupportLeft.strokeWidth = 0.6;
widthLineSupportLeft.strokeColor = app.activeDocument.swatches[3].color;

// Add the width dimension right support line
var widthLineSupportRight = dimensionGroup.pathItems.add();
widthLineSupportRight.setEntirePath([
  [selectedObject.left + selectedObject.width, selectedObject.top + 20],
  [selectedObject.left + selectedObject.width, selectedObject.top - 20]
]);
widthLineSupportRight.filled = false;
widthLineSupportRight.stroked = true;
widthLineSupportRight.strokeWidth = 0.6;
widthLineSupportRight.strokeColor = app.activeDocument.swatches[3].color;

// Add the height dimension top support line
var heightLineSupportTop = dimensionGroup.pathItems.add();
heightLineSupportTop.setEntirePath([
  [selectedObject.left - 20, selectedObject.top],
  [selectedObject.left + 20, selectedObject.top]
]);
heightLineSupportTop.filled = false;
heightLineSupportTop.stroked = true;
heightLineSupportTop.strokeWidth = 0.6;
heightLineSupportTop.strokeColor = app.activeDocument.swatches[3].color;

// Add the height dimension bottom support line
var heightLineSupportBottom = dimensionGroup.pathItems.add();
heightLineSupportBottom.setEntirePath([
  [selectedObject.left - 20, selectedObject.top - selectedObject.height],
  [selectedObject.left + 20, selectedObject.top - selectedObject.height]
]);
heightLineSupportBottom.filled = false;
heightLineSupportBottom.stroked = true;
heightLineSupportBottom.strokeWidth = 0.6;
heightLineSupportBottom.strokeColor = app.activeDocument.swatches[3].color;

// Get the dimensions of the object in millimeters
var width = (selectedObject.width / 2.83464567).toFixed(2);
var height = (selectedObject.height / 2.83464567).toFixed(2);

// Add the width dimension text
var widthText = dimensionGroup.textFrames.add();
widthText.contents = width + " mm";
widthText.left = selectedObject.left + selectedObject.width / 2;
widthText.top = selectedObject.top + 25;
widthText.textRange.justification = Justification.CENTER;

// Add the height dimension text
var heightText = dimensionGroup.textFrames.add();
heightText.contents = height + " mm";
heightText.left = selectedObject.left + 7 - heightText.width;
heightText.top = selectedObject.top - selectedObject.height / 2 + heightText.height * 2;
heightText.rotate(90, true, true, true, true, Transformation.CENTER);
heightText.textRange.paragraphAttributes.justification = Justification.CENTER;

// Set the text frame properties
var textFrameProperties = {
    font: "Helvetica",
    size: 12,
    fillColor: app.activeDocument.swatches[0].color
};
widthText.textRange.characterAttributes.properties = textFrameProperties;
heightText.textRange.characterAttributes.properties = textFrameProperties;
