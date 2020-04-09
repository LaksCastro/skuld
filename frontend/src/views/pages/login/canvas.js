import { randomNumber } from "../../../scripts/utils";

function AnimateLoginCanvas(canvasNode) {
    const state = {
        canvasNode,
        canvas: null,
        colors: ["#EEDAFF", "#D0A5F5", "#B981E9", "#A467D9", "#8547BA"],

        constants: {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
        },
        getWindowSize: function () {
            return {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
            }
        },
        updateConstants: function () {
            this.constants = this.getWindowSize();
        },
        setSize: function (width, height) {
            this.canvasNode.width = width;
            this.canvasNode.height = height;
        },
        init: function () {
            const startAnimation = () => {
                this.initCanvas();
                this.initAnimation();
            }

            function initialize() {
                this.updateConstants();

                const { innerWidth, innerHeight } = this.constants;
                this.setSize(innerWidth, innerHeight)

                return initialize.bind(this);
            }

            window.addEventListener("resize", initialize.call(this));

            startAnimation();
        },
        initCanvas: function () {
            this.canvas = this.canvasNode.getContext('2d');
        },
        initAnimation: async function () {
            await this.runAnimation();
        },
        runAnimation: async function () {
            const rain = {
                length: 3,
                items: [],
                context: null,
                init: function (context) {
                    this.context = context;

                    Array.from({ length: this.length }).map(() => {
                        this.items.push(this.generateItem.call(this));
                    })
                },
                generateItem: function () {
                    const size = randomNumber(10, 50);

                    const { innerWidth, innerHeight } = this.context.constants;

                    const possiblePositions = ['', ''].map((_, i) => {
                        const useVertical = i === 0;

                        const a = [0 - size, 0];
                        const relativeB = randomNumber(0, (useVertical ? innerHeight : innerWidth));
                        const b = [relativeB - size, relativeB]

                        return {
                            x: useVertical ? a : b,
                            y: useVertical ? b : a
                        }
                    });

                    const pos = {
                        velocity: randomNumber(20, 40),
                        ...possiblePositions[randomNumber(0, 1)],
                        color: this.context.colors[randomNumber(0, 4)],
                    };

                    return pos;
                },
                animate: function () {

                    function runAnimation() {
                        this.nextFrame();
                        this.renderFrame();
                        requestAnimationFrame(runAnimation.bind(this));
                    }
                    runAnimation.call(this);
                },
                nextFrame: function () {
                    this.items = this.items.map(item => {
                        const { innerWidth, innerHeight } = this.context.constants;

                        const { x, y } = {
                            x: innerWidth,
                            y: innerHeight
                        }

                        let newPos = {
                            ...item,
                            x: [item.x[0] + item.velocity, item.x[1] + item.velocity],
                            y: [item.y[0] + item.velocity, item.y[1] + item.velocity],
                        }

                        if (newPos.x[0] >= x || newPos.y >= y[1])
                            newPos = this.generateItem();


                        return newPos;
                    });
                },
                renderFrame: function () {
                    this.context.clearCanvas();
                    this.items.forEach(item => {
                        const { x, y } = item;
                        this.context.drawLine(x[0], y[0], x[1], y[1], {
                            color: item.color,
                        });
                    });
                }
            }
            rain.init(this);

            requestAnimationFrame(rain.animate.bind(rain));
        },
        clearCanvas: function () {
            this.canvas.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
        },
        drawLine: function (xI, yI, xF, yF, {
            color
        }) {
            const line = new Path2D();

            line.moveTo(xI, yI);
            line.lineTo(xF, yF);

            this.canvas.beginPath();

            this.canvas.shadowBlur = 20;
            this.canvas.shadowColor = "rgba(0,0,0,0.12)";
            this.canvas.strokeStyle = color;

            this.canvas.stroke(line);
        },
        drawRandomLine: function (xI, yI, xF, yF) {
            const useIrreg = randomNumber(0, 3) === 3;
            const irregularity = useIrreg ? randomNumber(10, 20) : 0;

            const zIndex = effect * 3;

            const line = new Path2D();

            line.moveTo(xI + zIndex, yI + zIndex + irregularity);
            line.lineTo(xF - zIndex, yF - zIndex + irregularity);

            this.canvas.beginPath();


            this.canvas.stroke(line);
        }
    }
    state.init();
}

export default AnimateLoginCanvas;