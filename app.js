// 1. Initialisation de la scène WebGL
const app = new PIXI.Application({
    width: 600,   // Remplace par la largeur de ton image
    height: 800,  // Remplace par la hauteur de ton image
    backgroundColor: 0x111111
});
document.body.appendChild(app.view);

// 2. Chargement des images (Elles doivent être dans le même dossier sur GitHub)
PIXI.Assets.load([
    'photo.jpg', 
    'carte-profondeur.jpg'
]).then((textures) => {
    
    // Conteneur principal
    const conteneur = new PIXI.Container();
    app.stage.addChild(conteneur);

    // Ajout de la photo normale
    const image = new PIXI.Sprite(textures['photo.jpg']);
    image.width = app.screen.width;
    image.height = app.screen.height;
    conteneur.addChild(image);

    // 3. Configuration de la carte de profondeur (Le "Displacement Filter")
    const spriteProfondeur = new PIXI.Sprite(textures['carte-profondeur.jpg']);
    spriteProfondeur.width = app.screen.width;
    spriteProfondeur.height = app.screen.height;
    
    // Pixi a besoin que la carte soit sur la scène, mais on la rend invisible
    app.stage.addChild(spriteProfondeur);
    spriteProfondeur.renderable = false; 

    // On applique le filtre de déformation à notre photo
    const filtreDeplacement = new PIXI.filters.DisplacementFilter(spriteProfondeur);
    conteneur.filters = [filtreDeplacement];

    // Initialisation au centre (aucune déformation au chargement)
    filtreDeplacement.scale.x = 0;
    filtreDeplacement.scale.y = 0;

    // 4. Animation avec la souris
    app.stage.interactive = true;
    app.stage.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);
    
    app.stage.on('mousemove', (event) => {
        // Position de la souris
        const sourisX = event.global.x;
        const sourisY = event.global.y;

        // Calculer la distance par rapport au centre de l'image
        const centreX = app.screen.width / 2;
        const centreY = app.screen.height / 2;

        // Le diviseur (ici 20) contrôle la puissance de l'effet. 
        // Plus le chiffre est petit, plus le visage va se déformer.
        const decalageX = (sourisX - centreX) / 20; 
        const decalageY = (sourisY - centreY) / 20;

        // Appliquer la déformation de manière fluide
        filtreDeplacement.scale.x = decalageX;
        filtreDeplacement.scale.y = decalageY;
    });
});