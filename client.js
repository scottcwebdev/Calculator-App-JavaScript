var jsCalculator = {
  numberStorage: [],
  numberInput: function() {
    var dotNumber = '.';
    var removeDuplicateDecimals;

    //Check if numberStorage has duplicate decimals, if so filter them out.
    removeDuplicateDecimals = this.numberStorage.filter(function(element,index) {
      if (element === dotNumber) {
        return jsCalculator.numberStorage.indexOf(element) === index;
      } else {
        return element;
      }
    });

    //Take the results from removeDuplicateDecimals and push them to arithmeticStorage.
    removeDuplicateDecimals.forEach(function(element, index) {
      jsCalculator.arithmeticStorage.push(element);
    });

  },
  arithmeticStorage: [],
  plusMinusOperator: function() {
    var dotNumber = '.';
    var removeDuplicateDecimals;

    //If numberStorage.length === 0 then return 0.
    if (this.numberStorage.length === 0) {
      this.numberStorage = [this.arithmeticResult()];
    }

    //Filter out duplicate decimals
    removeDuplicateDecimals = jsCalculator.numberStorage.filter(function(element,index) {
      if (element === dotNumber) {
        return jsCalculator.numberStorage.indexOf(element) === index;
      } else {
        return element;
      }
    });

    removeDuplicateDecimals = eval(removeDuplicateDecimals.join(''));
    removeDuplicateDecimals *= -1;

    this.numberStorage = [removeDuplicateDecimals.toString()];

  },
  percentage: function() {
    var dotNumber = '.';
    var removeDuplicateDecimals;

    //If numberStorage.length === 0 then return 0.
    if (this.numberStorage.length === 0) {
      this.numberStorage = [this.arithmeticResult()];
    }

    //Filter out duplicate decimals
    removeDuplicateDecimals = jsCalculator.numberStorage.filter(function(element,index) {
      if (element === dotNumber) {
        return jsCalculator.numberStorage.indexOf(element) === index;
      } else {
        return element;
      }
    });

    removeDuplicateDecimals = eval(removeDuplicateDecimals.join(''));
    removeDuplicateDecimals /= 100;

    this.numberStorage = [removeDuplicateDecimals.toString()];
  },
  arithmeticResult: function() {
    var addOperator = '+';
    var minusOperator = '-';
    var multiplyOperator = '*';
    var divideOperator = '/';
    var result;

    //Filter out Math Operators (+,-,*,/) that don't have a number to the left
    //Example 1++1 will filter to 1+1
    result = jsCalculator.arithmeticStorage.filter(function(element, index) {
      if (element === addOperator ||
         element === minusOperator ||
         element === multiplyOperator ||
         element === divideOperator) {
        if (element !== jsCalculator.arithmeticStorage[index - 1]) {
          return element;
        }
      } else {
        return element;
      }
    });

    //Delete last item in the result Array if it's a math operator (+, -, *, /)
    //Example 1++ will filter to 1
    result.forEach(function(element, index) {
      if (result[result.length - 1] === addOperator ||
         result[result.length - 1] === minusOperator ||
         result[result.length - 1] === multiplyOperator ||
         result[result.length - 1] === divideOperator) {
        result.pop();
      }


    //Delete the first item in the resuly Array if it's a multliplication or division operator
    //Example *1+1 will filter to 1+1
      if (result[result.length - result.length] === multiplyOperator ||
         result[result.length - result.length] === divideOperator) {
        result.shift();
      }
    });

    //Flag an error if the arithmetic cannot be performed
    //Example 1+*1 will equal ERROR
    try {
      result = eval(result.join(''));
      return result;
    } catch(err) {
      return 'ERROR';
    }
  },
  allClear: function() {
    //Clear the numberStorage and arithmeticStorage Array's when the AC button is clicked.
    this.numberStorage = [];
    this.arithmeticStorage = [];
  }
};

var handlers = {
  setUpEventListeners: function() {
    //Button Event Delegation
    var buttonClicks = document.getElementById('buttons');

    buttonClicks.addEventListener('click', function(event) {
      var elementClicked = event.target;

      if (elementClicked.className === 'number') {
        jsCalculator.numberStorage.push(elementClicked.value);
        view.numberDisplay(elementClicked.value);
      } else if (elementClicked.className === 'operator') {
        jsCalculator.numberInput();
        jsCalculator.numberStorage = [];
        jsCalculator.arithmeticStorage.push(elementClicked.value);
        view.operatorDisplay();
      } else if (elementClicked.id === 'equal') {
        jsCalculator.numberInput();
        jsCalculator.numberStorage = [];
        jsCalculator.arithmeticResult();
        jsCalculator.arithmeticStorage.push(jsCalculator.arithmeticResult());
        jsCalculator.arithmeticStorage.splice(0, jsCalculator.arithmeticStorage.length - 1);
        view.arithmeticResult();
      } else if (elementClicked.id === 'allClear') {
        jsCalculator.allClear();
        view.allClear();
      } else if (elementClicked.id === 'plusMinus') {
        jsCalculator.plusMinusOperator();
        view.plusMinusOperator();
      } else if (elementClicked.id === 'percentage') {
        jsCalculator.percentage();
        view.plusMinusOperator();
      }
    });
  }
};

var view = {
  numbersArray: [],
  numberDisplay: function(buttonValue) {
    var buttonValue = buttonValue;
    var dotNumber = '.';
    var printedNumber;
    var getScreenElement = document.getElementById('screen');
    var removeDuplicateDecimals;

    //Push the value of the button to numbersArray
    this.numbersArray.push(buttonValue);

    //Remove duplicate decimals from numbersArray.
    removeDuplicateDecimals = view.numbersArray.filter(function(element, index) {
      if (element === dotNumber) {
        return view.numbersArray.indexOf(element) === index;
      } else {
        return element;
      }
    });

    //Only display the first 9 characters
    removeDuplicateDecimals = removeDuplicateDecimals.join('');
    printedNumber = removeDuplicateDecimals.substring(0, 9);

    getScreenElement.innerHTML = printedNumber;
  },
  operatorDisplay: function() {
    //When an Operator is clicked, clear the numbersArray so it doesn't display.
    this.numbersArray = [];
  },
  arithmeticResult: function() {
    var arithmeticStorage = jsCalculator.arithmeticStorage;
    var arithmeticResult = jsCalculator.arithmeticResult();
    var resultString;
    var shortenedString = '';
    var getScreenElement = document.getElementById('screen');

    //If there's nothing in the arithmeticResult then display 0; else display the value.
    if (arithmeticResult === undefined) {
      getScreenElement.innerHTML = '0';
      return;
    } else {
      resultString = arithmeticResult.toString();
    }

    //If the resultString length is > than 11 characters then display an exponential number; else - display the result.
    if (resultString.length > 11) {
      getScreenElement.innerHTML = arithmeticResult.toExponential(4);
    } else {
      arithmeticResult = arithmeticResult.toLocaleString();
      getScreenElement.innerHTML = arithmeticResult;
    }

    this.numbersArray = [];
  },
  plusMinusOperator: function() {
    var plusMinusStorage = jsCalculator.numberStorage;
    var getScreenElement = document.getElementById('screen');

    getScreenElement.innerHTML = plusMinusStorage;
  },
  allClear: function() {
    var getScreenElement = document.getElementById('screen');

    //Clear the display.
    getScreenElement.innerHTML = '';
    this.numbersArray = [];
  }
}

handlers.setUpEventListeners(); 
