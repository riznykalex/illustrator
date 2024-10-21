// Функція для переведення мм у пункти
function mmToPoints(mm) {
    return mm * 2.834645669; // Використовуємо точніше значення
}

// Функція для переведення пунктів у мм
function pointsToMM(points) {
    return points * 0.352778; // Переводимо пункти в мм
}

// Функція для форматування розміру без зайвих десяткових цифр
function formatSize(value) {
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(3);
}

// Функція для створення діалогу
function createDialog() {
    var dialog = new Window('dialog', 'Налаштування монтажної області');

    // Задаємо фон діалогового вікна
    dialog.graphics.backgroundColor = dialog.graphics.newBrush(dialog.graphics.BrushType.SOLID_COLOR, [0.3, 0.3, 0.3]); // Темно-сірий фон

    // Створюємо функцію для встановлення білого кольору тексту
    function setTextColor(text) {
        text.graphics.foregroundColor = text.graphics.newPen(text.graphics.PenType.SOLID_COLOR, [1, 1, 1], 1); // Білий колір
    }

    // Перший рядок: Ширина матеріалу
    var group1 = dialog.add('group');
    var materialWidthLabel = group1.add('statictext', undefined, 'Ширина матеріалу (мм):');
    setTextColor(materialWidthLabel); // Встановлюємо білий колір
    var materialWidthInput = group1.add('edittext', undefined, '250', {
        multiline: false
    });
    materialWidthInput.characters = 10; // Збільшуємо розмір поля введення

    // Другий рядок: Z та Рапорт
    var group2 = dialog.add('group');
    var zLabel = group2.add('statictext', undefined, 'Z:');
    setTextColor(zLabel); // Встановлюємо білий колір
    var ZInput = group2.add('edittext', undefined, '88', {
        multiline: false
    });
    ZInput.characters = 5; // Збільшуємо розмір поля введення

    var rapportText = group2.add('statictext', undefined, 'Рапорт: 279.4 мм'); // Початкове значення для Z = 88
    setTextColor(rapportText); // Встановлюємо білий колір

    // Новий рядок: Етикетка
    var group3 = dialog.add('group');
    var labelLabel = group3.add('statictext', undefined, 'Етикетка:');
    setTextColor(labelLabel); // Встановлюємо білий колір

    var labelDimensionsText = group3.add('statictext', undefined, 'Виділіть етикету');
    setTextColor(labelDimensionsText); // Встановлюємо білий колір

    // Додамо чекбокс для "Випуск 1 мм"
    var bleedCheckbox = group3.add('checkbox', undefined, 'Випуск 1 мм');
    bleedCheckbox.value = true; // За замовчуванням активний
    setTextColor(bleedCheckbox); // Встановлюємо білий колір для тексту чекбокса

    // Рядок для кількості по рапорту та AC
    var labelGroup = dialog.add('group');
    var labelCountLabel = labelGroup.add('statictext', undefined, 'Кількість по рапорту:');
    setTextColor(labelCountLabel); // Встановлюємо білий колір
    var labelCountText = labelGroup.add('statictext', undefined, '');
    setTextColor(labelCountText); // Встановлюємо білий колір

    // Новий рядок: Кількість по ширині
    var group5 = dialog.add('group');
    var labelCountWidthLabel = group5.add('statictext', undefined, 'Кількість по ширині:');
    setTextColor(labelCountWidthLabel); // Встановлюємо білий колір
    var labelCountWidthInput = group5.add('edittext', undefined, '2', {multiline: false});
    labelCountWidthInput.characters = 5;
    
    // Новий рядок: Відстань
    var group6 = dialog.add('group');
    var distanceLabel = group6.add('statictext', undefined, 'Відстань між етикетками (мм):');
    setTextColor(distanceLabel); // Встановлюємо білий колір
    var distanceInput = group6.add('edittext', undefined, '3', {multiline: false});
    distanceInput.characters = 5;

    // Функція для перевірки виділеного об'єкта і обчислення кількості етикеток
    function checkSelectedObject(rapport) {
        var selection = app.activeDocument.selection;
        if (selection.length > 0 && selection[0].typename === 'PathItem') {
            var selectedObject = selection[0];
            var objectWidth = selectedObject.width;
            var objectHeight = selectedObject.height;
            var objectWidthMM = pointsToMM(objectWidth);
            var objectHeightMM = pointsToMM(objectHeight);

            if (bleedCheckbox.value) {
                objectWidthMM -= 2;
                objectHeightMM -= 2;
            }

            labelDimensionsText.text = formatSize(objectWidthMM) + ' x ' + formatSize(objectHeightMM) + ' мм';

            var labelCount = Math.floor(rapport / objectHeightMM);
            var AC = rapport / labelCount;

            labelCountText.text = labelCount + ' AC: ' + AC.toFixed(3) + ' мм';
            if (AC > objectHeightMM * 1.1) {
                labelCountText.graphics.foregroundColor = labelCountText.graphics.newPen(labelCountText.graphics.PenType.SOLID_COLOR, [1, 0, 0], 1);
            } else {
                labelCountText.graphics.foregroundColor = labelCountText.graphics.newPen(labelCountText.graphics.PenType.SOLID_COLOR, [1, 1, 1], 1);
            }
        } else {
            labelDimensionsText.text = 'Виділіть етикету';
            labelCountText.text = '';
            labelCountText.graphics.foregroundColor = labelCountText.graphics.newPen(labelCountText.graphics.PenType.SOLID_COLOR, [1, 1, 1], 1);
        }
    }

    ZInput.onChange = function () {
        var Z = parseFloat(ZInput.text);
        var rapport = Z * 3.175;
        checkSelectedObject(rapport);
    };

    checkSelectedObject(ZInput.text * 3.175);

    function updateDependentValues() {
        var Z = parseFloat(ZInput.text);
        if (!isNaN(Z)) {
            var rapport = Z * 3.175;
            rapportText.text = 'Рапорт: ' + rapport.toFixed(3) + ' мм';
            checkSelectedObject(rapport);
            labelCountText.graphics.foregroundColor = labelCountText.graphics.newPen(labelCountText.graphics.PenType.SOLID_COLOR, [1, 1, 1], 1);
        } else {
            rapportText.text = 'Рапорт: -';
        }
    }

    bleedCheckbox.onClick = function () {
        checkSelectedObject();
    };

    var group4 = dialog.add('group');
    var okButton = group4.add('button', undefined, 'OK');

    okButton.onClick = function () {
        var materialWidth = parseFloat(materialWidthInput.text);
        var Z = parseFloat(ZInput.text);

        if (isNaN(materialWidth) || isNaN(Z)) {
            alert("Будь ласка, введіть коректні числові значення.");
            return;
        }

        var rapport = Z * 3.175;

        if (app.activeDocument.selection.length > 0 && app.activeDocument.selection[0].typename === 'PathItem') {
            resizeArtboard(materialWidth, rapport);
            var distance = parseInt(distanceInput.text, 10);
            var rowCount = parseInt(labelCountWidthInput.text, 10);
            var objectHeightMM = pointsToMM(app.activeDocument.selection[0].height);           var BF = pointsToMM(app.activeDocument.selection[0].width) + distance;
            var labelCount = Math.floor(rapport / objectHeightMM);
            var AC = rapport / labelCount;

            duplicateAndPositionObjects(AC, labelCount, BF, rowCount);
            resizeArtboard(materialWidth, rapport);
        } else {
            alert("Виділіть етикетку.");
        }

        dialog.close();
    };

    dialog.show();
}

// Функція для зміни розміру монтажної області і центрування координати (0, 0)
function resizeArtboard(materialWidth, rapport) {
    var doc = app.activeDocument;
    var artboard = doc.artboards[0];

    // Обчислюємо нові розміри монтажної області
    var newWidth = mmToPoints(materialWidth);
    var newHeight = mmToPoints(rapport);

    // Оновлюємо розміри монтажної області так, щоб (0, 0) було в центрі
    artboard.artboardRect = [-newWidth / 2, newHeight / 2, newWidth / 2, -newHeight / 2];
}

// Функція для копіювання об'єктів і зміни їх координат по y
function duplicateAndPositionObjects(AC, labelCount, BF, rowCount) {

    var doc = app.activeDocument;
    var selection = doc.selection;

    if (selection.length > 0 && selection[0].typename === 'PathItem') {
        var originalObject = selection[0];
        var objects = [originalObject];

        // Центруємо перший об'єкт на (0, 0)
        originalObject.position = [0, 0];

        // Початкові координати для нового об'єкта
        var currentY = 0;

        // Копіюємо і розміщуємо об'єкти
        for (var i = 1; i < labelCount; i++) {
            var newObject = objects[objects.length - 1].duplicate(); // Дублюємо останній об'єкт
            currentY -= mmToPoints(AC); // Зменшуємо координату y на AC
            newObject.position = [0, currentY]; // Встановлюємо нову позицію
            objects.push(newObject); // Додаємо новий об'єкт у масив
        }

        // Виділяємо всі створені об'єкти
        doc.selection = objects;
        // Конвертація BF мм в пункти
        var shiftX = mmToPoints(BF);
        
        for (var j = 1; j < rowCount; j++){
            for (var i = 0; i < objects.length; i++){
                var currentPosition = objects[i].position; // Отримуємо поточну позицію
                var duplicatedObject = objects[i].duplicate();
                duplicatedObject.position = [currentPosition[0] + shiftX*j, currentPosition[1]];
            }
        }
        
        // Тепер виділяємо всі об'єкти, включаючи дублікати
        doc.selection = objects;


            var idoc = app.activeDocument;
            var pageItemsCount = idoc.pageItems.length;
            var margins = 0;
                if (margins >= 0) {
                    var activeABindex = idoc.artboards.getActiveArtboardIndex();
                    var newAB = idoc.artboards[activeABindex];
                    var iartBounds = idoc.visibleBounds;
                    var ableft = iartBounds[0]-margins*2.834645669;
                    var abtop = iartBounds[1]+margins*2.834645669; 
                    var abright = iartBounds[2]+margins*2.834645669;
                    var abbottom = iartBounds[3]-margins*2.834645669;

                    newAB.artboardRect = [ableft, abtop, abright, abbottom];

                    var myZoom = idoc.activeView.zoom;
                    idoc.activeView.zoom = myZoom + .01;
                    idoc.activeView.zoom = myZoom;

                } else {
                    alert("nos vamos");
                }

    } else {
        alert('Виділіть етикету для копіювання.');
    }
}

// Функція для зміни розміру артборду за даними з діалогового вікна, центруючи його
function resizeArtboard(materialWidth, rapport) {
    var newWidth = mmToPoints(materialWidth); // Конвертуємо ширину матеріалу в пунти
    var newHeight = mmToPoints(rapport); // Конвертуємо рапорт у пунти

    var artboard = app.activeDocument.artboards[0]; // Отримуємо перший артборд
    var currentRect = artboard.artboardRect; // Отримуємо поточні координати артборду

    // Вираховуємо нові координати, щоб збільшити розмір артборду від центру
    var centerX = (currentRect[0] + currentRect[2]) / 2; // Знаходимо центр по X
    var centerY = (currentRect[1] + currentRect[3]) / 2; // Знаходимо центр по Y

    artboard.artboardRect = [
        centerX - newWidth / 2, // Ліва координата
        centerY + newHeight / 2, // Верхня координата
        centerX + newWidth / 2, // Права координата
        centerY - newHeight / 2  // Нижня координата
    ];
}

// Запускаємо діалог
createDialog();