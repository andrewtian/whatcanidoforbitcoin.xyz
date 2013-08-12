(function($) {
    var groupNode;
    var choiceIndex = [];
    var choices = [];
    var stack = [];

    function updateCurrentChoice(lastIndex) {
        var lastChoice = $('.choices li', groupNode)[choices[choices.length - 1][lastIndex]];
        var choice = $('.choices li', groupNode)[choices[choices.length - 1][choiceIndex[choiceIndex.length - 1]]];
        lastChoice.style.display = 'none';
        choice.style.display = 'inline';
        $('#ok')[0].firstChild.href = choice.hasAttribute('next-group') ?
            '' : choice.getAttribute('target');
    }

    function nextChoice() {
        var lastIndex = choiceIndex[choiceIndex.length - 1];
        choiceIndex[choiceIndex.length - 1]++;
        if (choiceIndex[choiceIndex.length - 1] === $('.choices li', groupNode).length) {
            choiceIndex[choiceIndex.length - 1] = 0;
        }
        updateCurrentChoice(lastIndex);
    }

    function switchGroup(group) {
        //+ Jonas Raoni Soares Silva
        //@ http://jsfromhell.com/array/shuffle [rev. #1]
        function shuffle(v) {
            for (var j, x, i = v.length; i; j = parseInt(Math.random() * i, 10), x = v[--i], v[i] = v[j], v[j] = x){}
            return v;
        }

        groupNode = document.getElementById(group);
        if (!stack.length || stack[stack.length - 1] !== group) {
            stack.push(group);
            choiceIndex.push(0);


            var c = [];
            for (var i = 0; i < $('.choices li', groupNode).length; i++) {
                c.push(i);
            }
            choices.push(shuffle(c));
        }
        $('#back')[0].style.display = group === 'proglang' ? 'none' : '';
        $('#next')[0].style.display = group !== 'proglang' && choices[choices.length - 1].length == 1 ? 'none' : '';
        $('.question', groupNode)[0].style.display = 'block';
        updateCurrentChoice(choiceIndex[choiceIndex.length - 1]);
    }

    function cleanUpCurrent() {
        if (!groupNode) {
            return;
        }
        $('.question', groupNode)[0].style.display = 'none';
        var lastChoice = $('.choices li', groupNode)[choices[choices.length - 1][choiceIndex[choiceIndex.length - 1]]];
        lastChoice.style.display = 'none';
    }

    function investigate(ev) {
        ev.preventDefault();
        var choice = $('.choices li', groupNode)[choices[choices.length - 1][choiceIndex[choiceIndex.length - 1]]];
        if (choice.hasAttribute('next-group')) {
            cleanUpCurrent();
            switchGroup(choice.getAttribute('next-group'));
        } else {
            window.open(choice.getAttribute('target'));
        }
    }

    function takeBack() {
        cleanUpCurrent();
        stack.splice(stack.length - 1, 1);
        choiceIndex.splice(choiceIndex.length - 1, 1);
        choices.splice(choices.length - 1, 1);
        switchGroup(stack[stack.length - 1]);
    }

    function langChange() {
        document.webL10n.setLanguage(this.value);
    }

    $(window).load(function() {
        $('#ok').on('click', investigate);
        $('#next').on('click', nextChoice);
        $('#back').on('click', takeBack);
        $('#lang select').on('change', langChange);

        // Detected browser language
        var browserLang = document.webL10n.getLanguage();
        // Default language (value of the selected <option> element)
        var defaultLang = $("#lang option:selected").val();

        if (defaultLang !== browserLang) {
            var option = $('#lang option[value=' + browserLang + ']');
            if (option.length) {
                // If the browser language is supported, select the good option
                option.attr('selected', 'selected');
            } else {
                // Else set the default language
                document.webL10n.setLanguage(defaultLang);
            }
        }

        var query = window.location.hash.substring(1);
        switchGroup('proglang');
        if (query.length === 0) {
            return;
        }

        var node = document.querySelector('li[next-group="' + query + '"]');
        if (!node) {
            return;
        }
        node = node.parentNode.parentNode;
        while (node.has) {

        }

        cleanUpCurrent();
        switchGroup(query.substring(1));
    });
})(window.jQuery);
