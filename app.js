//TODO: add search and filtering
// add caret/info icon to show that you can click on attributes
// prevent styling from "wiggeling" when hovering over or clicking on attribute-container

{
    var app = {
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
            breedPicture: document.getElementById('breedPicture'),
            breedTitle: document.getElementById('breedTitle'),
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
            characterText: document.getElementById('characterText'),
            overview: document.getElementById('overview')
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
    };

    app.create.breed = (breedKey, breed) => {
        const dom = document.createElement('div');
        dom.id = breedKey;
        dom.className = 'breed';
        dom.innerHTML = `
            <h2>
                <span class="breed-title">${breed.title}</span>
                <img class="vdh" src="https://upload.wikimedia.org/wikipedia/commons/9/90/VDH_Logo.svg" title="Anerkannt durch den VDH (Verband für Deutsche Hundewesen)" alt="Anerkannt durch den VDH (Verband für Deutsche Hundewesen)">
                <img class="fci" src="https://upload.wikimedia.org/wikipedia/de/e/ea/FCI_Logo.svg" title="Anerkannt durch die FCI (Fédération Cynologique Internationale)" alt="Anerkannt durch die FCI (Fédération Cynologique Internationale)">
            </h2>
            <div class="breed-picture-container">
                <img class="breed-picture picture" src="${breed.img}" alt="breed">
                ${breed.bioData.bod ? '<img class="bod-img" class="icon" src="icons/warning.svg" title="Warnung: Qualzucht, Details siehe unten" alt="Warnung: Qualzucht, Details siehe unten">' : ''}
            </div>
        `;

        dom.addEventListener('click', function() {
           location.href = 'http://' + location.host + location.pathname + "?breed=" + breedKey;
        });

        return dom;
    }

    app.initialiseBreed = breed => {

        app.dom.overview.style.display = 'none';
        document.getElementById('breed').style.display = 'block';

        app.dom.breedPicture.src = breed.img;
        app.dom.breedTitle.textContent = breed.title;

        if (breed.bioData) {
            if (breed.bioData.vdh)
                app.dom.vdh.style.display = 'inline';
    
            if (breed.bioData.fci)
                app.dom.fci.style.display = 'inline';
    
            if (breed.bioData.bod) {
                app.dom.bod.style.display = 'block';
                app.dom.bodText.textContent = breed.bioData.bod;
            }
            else
                app.dom.bod.style.display = 'none';
    
            if (breed.bioData.listedDog) {
                app.dom.listed.style.display = 'block';
                app.dom.listedText.innerHTML = "Steht in folgenden Bundesländern auf der Liste für gefährliche Hunde:<br><b>" + breed.bioData.listedDog + "</b>";
            }
            else
                app.dom.listed.style.display = 'none';
    
            if (breed.bioData.origin) {
                app.dom.originIcon.src = `icons/country-${breed.bioData.origin}.svg`;
                app.dom.originTitle.textContent = app.data.countryNameLookup[breed.bioData.origin];
            }

            if (breed.bioData.character)
                app.dom.characterText.textContent = breed.bioData.character;

            if (breed.bioData.coatType)
                app.dom.coatType.textContent = breed.bioData.coatType;

            if (breed.bioData.colors)
                app.dom.coatColors.textContent = breed.bioData.colors;

            if (breed.bioData.specialColors)
                app.dom.coatSpecialColors.textContent = breed.bioData.specialColors;

            if (breed.bioData.fci && breed.bioData.fci instanceof Array && breed.bioData.fci.length > 1) {
                app.dom.fciMain.textContent = app.data.fciMainLookup[breed.bioData.fci[0]];
                // app.dom.fciSecondary.textContent = app.data.fciSecondaryLookup[breed.bioData.fci[0]][breed.bioData.fci[1]];
            }

            if (breed.bioData.lifeExpectancy)
                app.dom.lifeExpectancy.textContent = breed.bioData.lifeExpectancy + " Jahre";

            if (breed.bioData.weightMale)
                app.dom.weightMale.textContent = breed.bioData.weightMale + "kg";

            if (breed.bioData.weightFemale)
                app.dom.weightFemale.textContent = breed.bioData.weightFemale + "kg";                

            if (breed.bioData.heightMale)
                app.dom.heightMale.textContent = breed.bioData.heightMale + "cm Schulterhöhe, ";

            if (breed.bioData.heightFemale)
                app.dom.heightFemale.textContent = breed.bioData.heightFemale + "cm Schulterhöhe, ";
        }

        breed.attributes.forEach(attribute => {
            app.dom.attributes.appendChild(app.create.attribute(attribute));
        });

        breed.drives.forEach(attribute => {
            app.dom.drives.appendChild(app.create.attribute(attribute));
        });

        breed.links.forEach(link => {
            app.dom.links.appendChild(app.create.link(link));
        });
    };

    app.initialiseOverview = breeds => {
        for (const key in breeds)
            app.dom.overview.appendChild(app.create.breed(key, breeds[key]));
    };

    app.init = async () => {
        await fetch('./data.json')
        .then((response) => response.json())
        .then(json => {
            const breeds = json["breeds"]; 
            const breed = json["breeds"][app.data.query.breed];

            if (breed)
                return app.initialiseBreed(breed);

            app.initialiseOverview(breeds);
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