import { BufferGeometry, Color, Float32BufferAttribute, Line, LineBasicMaterial, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { EditorMath } from "../Utility/editorMath";
import { EditorUtility } from "../Utility/editorUtility";



export class EditorGrid extends Line{

    private _start = new Vector3();

    private _end = new Vector3();
    
    readonly type: string | "EditorGrid" = "EditorGrid"

    constructor(camera: OrthographicCamera | PerspectiveCamera, color = 0x797979, division: number = 1,  editorScale: number = 1) {

        super();

        const geometry = new BufferGeometry();

        const material = new LineBasicMaterial( { vertexColors: true, toneMapped: false, transparent: true, depthTest: false } );

        const cameraPos = EditorUtility.getCamViewMinMaxPoints(camera);


        const gridColor = new Color(color);

        const ver = [];
        const col: number[] = [];

        const step = division / editorScale;
        const dif = EditorMath.milimeterToPixel(1) / camera.zoom;

        const minX = cameraPos.minX - dif;
        const maxX = cameraPos.maxX + dif;

        const minY = cameraPos.minY - dif;
        const maxY = cameraPos.maxY + dif;

        let currentY = 0;
        let currentX = 0;


        while(currentY < cameraPos.maxY) {
            ver.push(maxX, currentY, 0, minX , currentY, 0);
            currentY += step;
            ver.push(minX, currentY, 0, maxX , currentY, 0);
            currentY += step;
        }
        currentX = 0;
        while(currentY > cameraPos.minY) {
            ver.push(maxX, currentY, 0, minX , currentY, 0);
            currentY -= step;
            ver.push(minX, currentY, 0, maxX , currentY, 0);
            currentY -= step;
        }

        while(currentY < cameraPos.maxY) {
            ver.push(maxX, currentY, 0, minX , currentY, 0);
            currentY += step;
            ver.push(minX, currentY, 0, maxX , currentY, 0);
            currentY += step;
        }

        ver.push(maxX, currentY, 0, minX , currentY, 0);
        currentY += step;

        while(currentX < cameraPos.maxX) {
            ver.push(currentX, maxY, 0, currentX , minY, 0);
            currentX += step;
            ver.push(currentX, minY, 0, currentX , maxY, 0);
            currentX += step;
        }

        currentY = 0;
        while(currentX > cameraPos.minX) {
            ver.push(currentX, maxY, 0, currentX , minY, 0);
            currentX -= step;
            ver.push(currentX, minY, 0, currentX , maxY, 0);
            currentX -= step;
        }


        for(let i = 0; i < ver.length; ++i){
            col.push(...gridColor.toArray());
        }

        geometry.setAttribute( 'position', new Float32BufferAttribute( ver, 3) );
        geometry.setAttribute('color', new Float32BufferAttribute( col, 3 ))
        
        this.geometry = geometry;
        this.material = material;

        //super(geometry, material);

        this.renderOrder = 100;
    }


    dispose(){
        if(this.material){
            (this.material as LineBasicMaterial).dispose();
        }

        this.geometry.dispose();
        
    }

    computeLineDistances() {

		const geometry = this.geometry;

		if ( geometry.index === null ) {

			const positionAttribute = geometry.attributes["position"];
			const lineDistances: number[] = [];

			for ( let i = 0, l = positionAttribute.count; i < l; i += 2 ) {

				this._start.fromBufferAttribute( positionAttribute, i );
				this._end.fromBufferAttribute( positionAttribute, i + 1 );

				lineDistances[ i ] = ( i === 0 ) ? 0 : lineDistances[ i - 1 ];
				lineDistances[ i + 1 ] = lineDistances[ i ] + this._start.distanceTo( this._end );

			}

			geometry.setAttribute( 'lineDistance', new Float32BufferAttribute( lineDistances, 1 ) );

		} else {

            /**
             * Warn jak w parent
             */
			console.warn( 'THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.' );

		}

		return this;

	}
}