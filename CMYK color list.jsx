function createColorList() {
    var doc = app.activeDocument;
    var layerName = "Color Info";
    var colorLayer;

    // Create or clear the "Color Info" layer
    try {
        colorLayer = doc.layers.getByName(layerName);
        colorLayer.pageItems.removeAll();
    } catch (e) {
        colorLayer = doc.layers.add();
        colorLayer.name = layerName;
    }

    var spotColors = doc.spots;
    var usedColors = {};
    var entryHeight = 20;
    var entryWidth = 200;
    var maxEntriesPerColumn = 20;
    var entryCount = 0;

    var activeArtboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    var artboardLeft = activeArtboard.artboardRect[0];
    var artboardTop = activeArtboard.artboardRect[1];
    var xPosition = artboardLeft + 20;
    var yPosition = artboardTop - 20;

    // Helper function to update position for new columns
    function updatePosition() {
        if (entryCount >= maxEntriesPerColumn) {
            xPosition += entryWidth;
            yPosition = artboardTop - 20;
            entryCount = 0;
        }
    }

    // Helper function to add a CMYK color if it's not already added
    function addCMYKColor(cmykColor) {
        // Round values to 1 if they're between 0.1 and 1
        var cyan = cmykColor.cyan < 1 && cmykColor.cyan > 0.1 ? 1 : Math.round(cmykColor.cyan);
        var magenta = cmykColor.magenta < 1 && cmykColor.magenta > 0.1 ? 1 : Math.round(cmykColor.magenta);
        var yellow = cmykColor.yellow < 1 && cmykColor.yellow > 0.1 ? 1 : Math.round(cmykColor.yellow);
        var black = cmykColor.black < 1 && cmykColor.black > 0.1 ? 1 : Math.round(cmykColor.black);

        var key = cyan + "-" + magenta + "-" + yellow + "-" + black;

        if (!usedColors[key]) {
            usedColors[key] = true;
            updatePosition();

            var cmykSquare = colorLayer.pathItems.rectangle(yPosition, xPosition, 10, 10);
            cmykSquare.fillColor = cmykColor;
            cmykSquare.strokeColor = new NoColor();

            var cmykTextFrame = colorLayer.textFrames.add();
            cmykTextFrame.contents = "C:" + cyan + " M:" + magenta + " Y:" + yellow + " K:" + black;
            cmykTextFrame.position = [cmykSquare.left + 15, cmykSquare.top];

            // Mark text with red if all values are greater than 0 or if any value is between 1 and 3
            if ((cyan > 0 && magenta > 0 && yellow > 0 && black > 0) || 
                (cyan >= 1 && cyan <= 3) || 
                (magenta >= 1 && magenta <= 3) || 
                (yellow >= 1 && yellow <= 3) || 
                (black >= 1 && black <= 3)) {
                var redColor = new CMYKColor();
                redColor.cyan = 0;
                redColor.magenta = 100;
                redColor.yellow = 100;
                redColor.black = 0;
                cmykTextFrame.textRange.fillColor = redColor;
            }

            yPosition -= entryHeight;
            entryCount++;
        }
    }

    // Helper function to check if a spot color is used in the document
    function isColorUsed(color) {
        for (var i = 0; i < doc.pageItems.length; i++) {
            var item = doc.pageItems[i];
            if ((item.filled && item.fillColor.spot && item.fillColor.spot.name === color.spot.name) ||
                (item.stroked && item.strokeColor.spot && item.strokeColor.spot.name === color.spot.name)) {
                return true;
            }
        }
        return false;
    }

    // Add only used spot colors to the list
    for (var i = 0; i < spotColors.length; i++) {
        if (spotColors[i].colorType === ColorModel.SPOT) {
            var spotColor = new SpotColor();
            spotColor.spot = spotColors[i];
            if (isColorUsed(spotColor)) {
                updatePosition();

                var square = colorLayer.pathItems.rectangle(yPosition, xPosition, 10, 10);
                square.fillColor = spotColor;
                square.strokeColor = new NoColor();

                var textFrame = colorLayer.textFrames.add();
                textFrame.contents = spotColors[i].name;
                textFrame.position = [square.left + 15, square.top];

                yPosition -= entryHeight;
                entryCount++;
            }
        }
    }

    // Check each object for used CMYK colors
    for (var j = 0; j < doc.pageItems.length; j++) {
        var item = doc.pageItems[j];
        if (item.filled && item.fillColor.typename === "CMYKColor") addCMYKColor(item.fillColor);
        if (item.stroked && item.strokeColor.typename === "CMYKColor") addCMYKColor(item.strokeColor);
    }
}

createColorList();
