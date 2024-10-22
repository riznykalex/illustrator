# Adobe Illustrator Label Layout Script

This script automates the process of duplicating and positioning labels in Adobe Illustrator based on user-specified parameters like material width, label dimensions, spacing, and the number of rows. It also adjusts the artboard size accordingly and includes flexible features like bleed control and precise label layout handling.

## Features

- **Label Duplication**: Automatically duplicates and positions selected labels in rows and columns based on user input.
- **Artboard Resizing**: Dynamically adjusts the artboard size to fit the label layout.
- **Bleed Option**: Subtracts 2 mm from the width and height of the labels when the "Bleed 1 mm" option is selected.
- **Customizable Parameters**: Users can specify material width, Z value, label spacing, number of labels per row, and rapport.
- **Precision**: Converts between millimeters and points with high precision, ensuring exact positioning of elements.
- **Interactive UI**: Dialog window for setting all parameters with real-time updates based on user input.

## Installation

1. Download or clone this repository to your local machine.
2. Open Adobe Illustrator and navigate to `File` > `Scripts` > `Other Script`.
3. Select the script file and click `Open`.
4. The script will launch with a dialog window for configuring label layout parameters.

## Usage

1. Select a label in the document.
2. Input the material width, Z value, number of labels per row, and spacing in the dialog window.
3. The script will automatically calculate and display the number of labels that can fit within the given rapport and material width.
4. Enable or disable the "Bleed 1 mm" checkbox depending on your design needs.
5. Click **OK** to generate the layout and adjust the artboard size.

## Parameters

- **Material Width**: The width of the material in millimeters (default: 250 mm).
- **Z Value**: A multiplier for the rapport (default: 88).
- **Rapport**: Automatically calculated as `Z * 3.175 mm`.
- **Label Spacing**: The distance between labels in millimeters (default: 3 mm).
- **Labels per Row**: The number of labels to place horizontally across the material width (default: 2).
- **Bleed**: Optional 1 mm bleed to subtract from the label dimensions.

## Example

If you select a label that is 70 x 70 mm, set the Z value to 88, and the number of labels per row to 2, the script will:
- Calculate the rapport as `279.4 mm`.
- Place the labels with 3 mm spacing between them.
- Resize the artboard to fit the duplicated labels and center it on (0,0).

