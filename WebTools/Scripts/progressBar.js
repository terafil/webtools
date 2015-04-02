function progressBar(config) {
    var currentStep = 0;
    var completedContainer;
    var textContainer;
    init();

    function init() {
        var node = document.getElementById(config.containerId);

        node.style.border = '1px solid black';
        node.style.position = 'relative';
        node.style.backgroundColor = 'gray';
        node.style.zIndex = '-1';

        completedContainer = document.createElement('span');
        completedContainer.style.backgroundColor = 'green';
        completedContainer.style.height = '100%';
        completedContainer.style.width = '0%';
        completedContainer.style.display = 'inline-block';
        completedContainer.style.position = 'absolute';
        completedContainer.style.zIndex = '1';

        textContainer = document.createElement('span');
        textContainer.style.height = '100%';
        textContainer.style.width = '100%';
        textContainer.style.position = 'absolute';
        textContainer.style.zIndex = '2';
        textContainer.style.textAlign = 'center';
        textContainer.style.verticalAlign = 'middle';
        textContainer.innerText = '0%';
        textContainer.style.color = 'white';

        node.appendChild(textContainer);
        node.appendChild(completedContainer);
    }

    return {
        step: function (stepsTaken) {
            if (currentStep < config.maxSteps) {
                if (stepsTaken) {
                    currentStep = Math.min(currentStep + stepsTaken, config.maxSteps);
                }
                else {
                    currentStep++;
                }

                var percentComplete = (currentStep / config.maxSteps) * 100;
                var wholePercent = Math.floor(percentComplete);

                completedContainer.style.width = wholePercent + '%';
                textContainer.innerText = wholePercent + '%';
            }
        },
        reset: function () {
            currentStep = 0;
            textContainer.innerText = '0%';
            completedContainer.style.width = '0%';
        }
    }
}