import { BufferGeometry, Color, Float32BufferAttribute, Line, Mesh, Object3D, PlaneGeometry, ShaderMaterial, Vector2 } from "three";

export class EditorCrossGrid extends Object3D {


    private shaderMaterial: ShaderMaterial;

    constructor(protected resolution:Vector2, protected zoom:number){
        super();

         // Parametry krzyżyka
         const crossWidth = 10; // Szerokość ramion krzyżyka
         const crossHeight = 10; // Wysokość pionowego ramienia
         const crossThickness = 0.1; // Grubość ramion
 
         // Shader
         const vertexShader = `
             varying vec2 vUv;
             void main() {
                 vUv = uv;
                 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
             }
         `;
 
         const fragmentShader = `
            varying vec2 vUv;
            uniform vec2 resolution;
            uniform float zoom;
            uniform float uDPR;
            void main() {
                // Definiujemy krzyżyk na płaszczyźnie XY
                float crossSize = 0.05; // Rozmiar krzyżyka
                float thickness = 1.0; // Grubość ramion

                float thicknessX = (1.0 / resolution.y / uDPR) ;
               // thicknessX /=zoom;
                float thicknessY = (1.0 / resolution.y / uDPR) ;
                //thicknessY /=zoom;

                vec2 pixelCoords = vUv;


                vec2 gridUV = fract(vUv * 10.0);

                float ratio = resolution.x / resolution.y;

                float crossSizeX = crossSize;
                float crossSizeY = crossSize;

                // Pozioma linia krzyżyka
                if (abs(pixelCoords.y - 0.5) < thicknessX && pixelCoords.x > 0.5 - crossSizeX && pixelCoords.x < 0.5 + crossSizeX) {
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Czerwony kolor
                }
                // Pionowa linia krzyżyka
                else if (abs(pixelCoords.x - 0.5) < thicknessY && pixelCoords.y > 0.5 - crossSizeY && pixelCoords.y < 0.5 + crossSizeY) {
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Czerwony kolor
                } else {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Przezroczyste tło
                }
            }
         `;
 
        const fragmentShader2 = `
precision highp float;

    varying vec2 vUv;
    uniform vec2 resolution;
    uniform float zoom;
    uniform float uDPR;

    void main() {

        float pixelSize = 1.0 / min(resolution.x, resolution.y) * uDPR; // Rozmiar jednego piksela w jednostkach świata (oparty na mniejszej osi)

        // Rozmiar krzyżyka w jednostkach świata
        float crossSize = 10.0 * pixelSize ; // Rozmiar krzyżyka skalowany przez zoom
        float thickness = 1.0; // Grubość linii w pikselach

        // Przeliczanie grubości linii na jednostki świata z uwzględnieniem zoomu
        
        float thicknessWorld = (thickness * pixelSize); // Grubość linii w jednostkach świata (uwzględnia zoom)
        

        // Pozioma linia krzyżyka
        float horizontal = step(abs(vUv.y - 0.5), thicknessWorld) *
                          step(abs(vUv.x - 0.5), crossSize);

        // Pionowa linia krzyżyka
        float vertical = step(abs(vUv.x - 0.5), thicknessWorld) *
                        step(abs(vUv.y - 0.5), crossSize);

        // Kolor krzyżyka
        vec3 color = vec3(1.0, 0.0, 0.0); // Czerwony kolor
        gl_FragColor = vec4(color, max(horizontal, vertical));
    }`

        const fragmentShader3 = `
            varying vec2 vUv;
            uniform vec2 resolution;
            void main() {
                // Szerokość linii w pikselach
                float lineWidth = 5.0; // 5 pikseli
                float lineThickness = 1.0; // Grubość 1 piksel

                // Przeliczanie współrzędnych UV na piksele
                vec2 pixelCoords = vUv * resolution;

                // Pozioma linia
                float line = step(abs(pixelCoords.y - resolution.y / 2.0), lineThickness) *
                            step(abs(pixelCoords.x - resolution.x / 2.0), lineWidth / 2.0);

                // Kolor linii
                vec3 color = vec3(1.0, 0.0, 0.0); // Czerwony kolor
                gl_FragColor = vec4(color, line);
            }
        ` 



         // Tworzenie materiału z shaderem
        this.shaderMaterial = new ShaderMaterial({
             vertexShader: vertexShader,
             fragmentShader: fragmentShader2,
             transparent: true, // Umożliwia przezroczyste tło,
             uniforms:{
                resolution: {value: this.resolution},
                zoom: {value:this.zoom},
                uDPR: {value: window.devicePixelRatio}
             }
         });
 
         // Tworzenie płaszczyzny (2D)
        // const geometry = new BufferGeometry();
        // geometry.setAttribute('position', new Float32BufferAttribute([0.0,0.0,0.0], 3));
         const geometry = new PlaneGeometry(crossWidth, crossHeight);
         const plane = new Mesh(geometry, this.shaderMaterial);
         this.add(plane);
        // this.createGemoetry();
        
    }

    public changeZoom(newZoom: number){

        
        this.shaderMaterial.uniforms.zoom.value = newZoom;
    }

    private createGemoetry(){
// Vertex Shader
const vertexShaderCode = `
    //attribute vec3 position;
    attribute vec3 next;
    attribute vec3 prev;
   //attribute vec2 uv;
    attribute float side;

    uniform vec2 uResolution;
    uniform float uDPR;
    uniform float uThickness;

    vec4 getPosition() {
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1);
        vec2 nextScreen = next.xy * aspect;
        vec2 prevScreen = prev.xy * aspect;

        vec2 tangent = normalize(nextScreen - prevScreen);
        vec2 normal = vec2(-tangent.y, tangent.x);
        normal /= aspect;
        normal *= 1.0 - pow(abs(uv.y - 0.5) * 2.0, 2.0);

        float pixelWidth = 1.0 / (uResolution.y / uDPR);
        normal *= pixelWidth * uThickness;

        // When the points are on top of each other, shrink the line to avoid artifacts.
        float dist = length(nextScreen - prevScreen);
        normal *= smoothstep(0.0, 0.02, dist);

        float ar = uResolution.x / uResolution.y;

        vec3 newPos = vec3(position);
        newPos.x *=uResolution.x;
        newPos.y *=uResolution.y;

        newPos.x *=51000.0;
        newPos.y *=51000.0;

      

        vec4 current = vec4(newPos, 1);
       // current.xy -= normal * side;
        //position.xy *= aspect;
        return  projectionMatrix * modelViewMatrix * current;
    }

    void main() {
        gl_Position = getPosition();
    }
`;

// Fragment Shader
const fragmentShaderCode = `
    precision highp float;

    void main() {
        // Kolor linii
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Czerwony kolor
    }
`;

// Tworzenie geometrii
const positions = [
    0.0, 0.1, 0.0, // Lewy koniec linii
     0.0, -0.1, 0.0  // Prawy koniec linii
];

const next = [
    1.0, 0.0, 0.0, // Dla pierwszego wierzchołka, następny to (1, 0)
    1.0, 0.0, 0.0  // Dla drugiego wierzchołka, następny to (1, 0)
];

const prev = [
    -1.0, 0.0, 0.0, // Dla pierwszego wierzchołka, poprzedni to (-1, 0)
    -1.0, 0.0, 0.0  // Dla drugiego wierzchołka, poprzedni to (-1, 0)
];

const uvs = [
    0.0, 0.0, // Lewy koniec linii
    1.0, 0.0  // Prawy koniec linii
];

const sides = [
    -1.0, // Lewa strona linii
     1.0  // Prawa strona linii
];

const geometry = new BufferGeometry();
geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
geometry.setAttribute('next', new Float32BufferAttribute(next, 3));
geometry.setAttribute('prev', new Float32BufferAttribute(prev, 3));
geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
geometry.setAttribute('side', new Float32BufferAttribute(sides, 1));

// Tworzenie materiału
const material = new ShaderMaterial({
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode,
    uniforms: {
        uResolution: { value: this.resolution },
        uDPR: { value: window.devicePixelRatio },
        uThickness: { value: 10.0 } // Grubość linii w pikselach
    },
    transparent: true // Umożliwia przezroczyste tło
});

// Tworzenie linii
const line = new Line(geometry, material);
this.add(line)
    }

}