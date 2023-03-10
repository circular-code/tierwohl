{
    var app = {
        race: "frenchBullDog",
        create: {},
        data: {
            query: getQueryParams(document.location.search),
            attributeDotColorLookupPositive: ["", "red","orange","yellow","lemon","green"],
            attributeDotColorLookupNegative: ["", "green", "lemon", "yellow", "orange", "red"],
            attributeTypeLookup: {health: 1, excercise: -1, human: 1, grooming: -1, allergy: 1, barking: -1},
            countryNameLookup: {"UK": "Groß Britannien", "FR": "Frankreich", "USA": "Vereinigte Staaten von Amerika"}
        },
        fn: {},
        dom: {
            attributes: document.getElementById('attributes'),
            drives: document.getElementById('drives'),
            racePicture: document.getElementById('racePicture'),
            raceTitle: document.getElementById('raceTitle'),
            vdh: document.getElementById('vdh'),
            fci: document.getElementById('fci'),
            bod: document.getElementById('bod'),
            bodText: document.getElementById('bodText'),
            listedText: document.getElementById('listedText'),
            originIcon: document.getElementById('originIcon'),
            originTitle: document.getElementById('originTitle'),
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
            <div class="attribute-container content-container">
                <img ${data.id === "herding" ? 'style="transform: scaleX(-1);"' : ''} src="icons/dog-${data.id}.svg" alt="${data.title}" class="icon">
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

        if (app.data.race.bioData) {
            if (app.data.race.bioData.vdh)
                app.dom.vdh.style.display = 'inline';
    
            if (app.data.race.bioData.fci)
                app.dom.fci.style.display = 'inline';
    
            if (app.data.race.bioData.bod)
                app.dom.bodText.textContent = app.data.race.bioData.bod;
    
            if (app.data.race.bioData.listedDog && app.data.race.bioData.listedDog instanceof Array && app.data.race.bioData.listedDog.length > 0)
                app.dom.listedText.innerHTML = "Steht in folgenden Bundesländern auf der Liste für gefährliche Hunde:<br><b>" + (app.data.race.bioData.listedDog.join(", ") || "") + "</b>";
    
            if (app.data.race.bioData.origin) {
                app.dom.originIcon.src = `icons/country-${app.data.race.bioData.origin}.svg`;
                app.dom.originTitle.textContent = app.data.countryNameLookup[app.data.race.bioData.origin];
            }
        }

        app.data.race.attributes.forEach(attribute => {
            app.dom.attributes.appendChild(app.create.attribute(attribute));
        });

        app.data.race.drives.forEach(attribute => {
            app.dom.drives.appendChild(app.create.attribute(attribute));
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