{
    var app = {
        race: "frenchBullDog",
        create: {},
        data: {
            query: getQueryParams(document.location.search),
            attributeDotColorLookupPositive: ["", "red","orange","yellow","lime","green"],
            attributeDotColorLookupNegative: ["", "green", "lime", "yellow", "orange", "red"],
            attributeTypeLookup: {health: 1, excercise: -1, human: 1, grooming: -1, allergy: 1, barking: -1},
            countryNameLookup: {"UK": "Groß Britannien", "FR": "Frankreich", "USA": "Vereinigte Staaten von Amerika"},
            fciMainLookup: ["", "Hütehunde und Treibhunde (ausgenommen Schweizer Sennenhunde)", "Pinscher und Schnauzer - Molosser - Schweizer Sennenhunde", "Terrier", "Dachshunde", "Spitze und Hunde vom Urtyp", "Laufhunde, Schweisshunde und verwandte Rassen", "Vorstehhunde", "Apportierhunde - Stöberhunde - Wasserhunde", "Gesellschafts- und Begleithunde", "Windhunde"],
            // fciSecondaryLookup: [
            //     [""],
            //     ["", "Schäferhunde", "Treibhunde (ausgenommen Schweizer Sennenhunde)"],
            //     ["", "Pinscher und Schnauzer", "Molossoide", "Schweizer Sennenhunde"],
            //     ["", "Hochläufige Terrier", "Niederläufige Terrier", "Bullartige Terrier", "Zwerg-Terriers"],
            //     ["", "-"],
            //     ["","Nordische Schlittenhunde","Nordische Jagdhunde","Nordische Wach- und Hütehunde","Europäische Spitze","Asiatische Spitze und verwandte Rassen","Urtyp","Urtyp - Hunde zur jagdlichen Verwendung"],
            //     ["","Laufhunde", "Schweisshunde","Verwandte Rassen"],
            //     ["","Kontinentale Vorstehhunde","Britische und Irische Vorstehhunde"],
            //     ["","Apportierhunde","Stöberhunde","Wasserhunde"],
            //     ["","Bichons und verwandte Rassen","Pudel","Kleine belgische Hunderassen","Haarlose Hunde","Tibetanische Hunderassen","Chihuahueno","Englische Gesellschaftsspaniel","Japanische Spaniel und Pekingesen","Kontinentaler Zwergspaniel und andere","Kromfohrländer","Kleine doggenartige Hunde"],
            //     ["","Langhaarige oder befederte Windhunde","Rauhhaarige Windhunde","Kurzhaarige Windhunde"],
            // ]
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
            listed: document.getElementById('listed'),
            listedText: document.getElementById('listedText'),
            originIcon: document.getElementById('originIcon'),
            originTitle: document.getElementById('originTitle'),
            links: document.getElementById('links'),
            coatType: document.getElementById('coatType'),
            coatColors: document.getElementById('coatColors'),
            coatSpecialColors: document.getElementById('coatSpecialColors'),
            fciMain: document.getElementById('fciMain'),
            fciSecondary: document.getElementById('fciSecondary'),
            lifeExpectancy: document.getElementById('lifeExpectancy'),
            weightMale: document.getElementById('weightMale'),
            weightFemale: document.getElementById('weightFemale'),
            heightMale: document.getElementById('heightMale'),
            heightFemale: document.getElementById('heightFemale'),
            characterText: document.getElementById('characterText')
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
                <div class="attribute-details hidden">
                    <ul id="social-details">
                        ${data.details.map(detail => '<li>' + detail + '</li>').join('')}
                    </ul>
                </div>
            </div>
        `;

        dom.addEventListener('click', function() {
            const details = dom.querySelector('.attribute-details');
            if (details.classList.contains('hidden')) {
                dom.classList.add('open');
                details.classList.remove('hidden')
            }
            else {
                dom.classList.remove('open');
                details.classList.add('hidden');
            }
        });

        return dom;
    }

    app.create.link = data => {
        const dom = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = data.name || "";
        link.href = data.url || "#";
        link.target = "_blank";

        dom.appendChild(link);
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
    
            if (app.data.race.bioData.bod) {
                app.dom.bod.style.display = 'block';
                app.dom.bodText.textContent = app.data.race.bioData.bod;
            }
            else
                app.dom.bod.style.display = 'none';
    
            if (app.data.race.bioData.listedDog) {
                app.dom.listed.style.display = 'block';
                app.dom.listedText.innerHTML = "Steht in folgenden Bundesländern auf der Liste für gefährliche Hunde:<br><b>" + app.data.race.bioData.listedDog + "</b>";
            }
            else
                app.dom.listed.style.display = 'none';
    
            if (app.data.race.bioData.origin) {
                app.dom.originIcon.src = `icons/country-${app.data.race.bioData.origin}.svg`;
                app.dom.originTitle.textContent = app.data.countryNameLookup[app.data.race.bioData.origin];
            }

            if (app.data.race.bioData.character)
                app.dom.characterText.textContent = app.data.race.bioData.character;

            if (app.data.race.bioData.coatType)
                app.dom.coatType.textContent = app.data.race.bioData.coatType;

            if (app.data.race.bioData.colors)
                app.dom.coatColors.textContent = app.data.race.bioData.colors;

            if (app.data.race.bioData.specialColors)
                app.dom.coatSpecialColors.textContent = app.data.race.bioData.specialColors;

            if (app.data.race.bioData.fci && app.data.race.bioData.fci instanceof Array && app.data.race.bioData.fci.length > 1) {
                app.dom.fciMain.textContent = app.data.fciMainLookup[app.data.race.bioData.fci[0]];
                // app.dom.fciSecondary.textContent = app.data.fciSecondaryLookup[app.data.race.bioData.fci[0]][app.data.race.bioData.fci[1]];
            }

            if (app.data.race.bioData.lifeExpectancy)
                app.dom.lifeExpectancy.textContent = app.data.race.bioData.lifeExpectancy + " Jahre";

            if (app.data.race.bioData.weightMale)
                app.dom.weightMale.textContent = app.data.race.bioData.weightMale + "kg";

            if (app.data.race.bioData.weightFemale)
                app.dom.weightFemale.textContent = app.data.race.bioData.weightFemale + "kg";                

            if (app.data.race.bioData.heightMale)
                app.dom.heightMale.textContent = app.data.race.bioData.heightMale + "cm Schulterhöhe, ";

            if (app.data.race.bioData.heightFemale)
                app.dom.heightFemale.textContent = app.data.race.bioData.heightFemale + "cm Schulterhöhe, ";
        }

        app.data.race.attributes.forEach(attribute => {
            app.dom.attributes.appendChild(app.create.attribute(attribute));
        });

        app.data.race.drives.forEach(attribute => {
            app.dom.drives.appendChild(app.create.attribute(attribute));
        });

        app.data.race.links.forEach(link => {
            app.dom.links.appendChild(app.create.link(link));
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