{
    var app = {
        race: "frenchBullDog",
        create: {},
        data: {
            query: getQueryParams(document.location.search),
            attributeDotColorLookupPositive: ["", "red","orange","yellow","lemon","green"],
            attributeDotColorLookupNegative: ["", "green", "lemon", "yellow", "orange", "red"],
            attributeTypeLookup: {health: 1, excercise: -1, human: 1, beginner: 1, grooming: -1, social: 1, allergy: 1, barking: -1}
        },
        fn: {},
        dom: {
            attributes: document.getElementById('attributes'),
            racePicture: document.getElementById('racePicture'),
            raceTitle: document.getElementById('raceTitle')
        }
    };

    app.create.attribute = data => {
        const type = app.data.attributeTypeLookup[data.id];
        const color = type === 1 ? app.data.attributeDotColorLookupPositive[data.value] : app.data.attributeDotColorLookupNegative[data.value];
        const dom = document.createElement('div');
        dom.id = data.id;
        dom.className = 'attribute';
        dom.innerHTML = `
            <h4 class="attribute-title">${data.title}</h4>
            <div class="attribute-container">
                <img src="icons/dog-${data.id}.svg" alt="${data.title}" class="attribute-image">
                <div class="attribute-dots">
                    <div class="${color} attribute-dot${data.value > 0 ? " attribute-dot-filled" : ""}"></div>
                    <div class="${color} attribute-dot${data.value > 1 ? " attribute-dot-filled" : ""}"></div>
                    <div class="${color} attribute-dot${data.value > 2 ? " attribute-dot-filled" : ""}"></div>
                    <div class="${color} attribute-dot${data.value > 3 ? " attribute-dot-filled" : ""}"></div>
                    <div class="${color} attribute-dot${data.value > 4 ? " attribute-dot-filled" : ""}"></div>
                </div>
                <div class="attribute-details">
                    <ul id="social-details">
                        ${data.details.map(detail => '<li>' + detail + '</li>').join('')}
                    </ul>
                </div>
            </div>
        `;

        return dom;
    }

    app.init = async function() {
        await fetch('./data.json')
        .then((response) => response.json())
        .then((json) => app.data.race = json["races"][app.data.query.race]);

        if (!app.data.race)
            return;

        app.dom.racePicture.src = app.data.race.img;
        app.dom.raceTitle.textContent = app.data.race.title;

        app.data.race.attributes.forEach(attribute => {
            app.dom.attributes.appendChild(app.create.attribute(attribute));
        });
    };

    app.init();

    function getQueryParams(qs) {
        qs = qs.split('+').join(' ');
    
        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;
    
        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
    
        return params;
    }
}