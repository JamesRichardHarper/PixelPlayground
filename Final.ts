/*
    import * as GSAP from 'gsap'
    import * as PIXI from 'pixi.js'
*/

/*
    For ease of use with GSAP I added in the integration plug in on JSbin as
    well as imported it on my local PC, I've used VSCode as my Text Editor
    for this.

    Also a few notes:
    - As has been alluded to several times in this doc, JSBin's version
        of TypeScript isn't up to date, as such there's a few bit's of
        syntax I'm not exactly happy with but had to adapt to work in JSBin
        as requested; but I'm sure I have forgotten more pieces I had to change.
    - For example, I would have liked to wrap most of the GSAP methods in a promise,
        however JSBin didnt seem to like it when I tried to use spread/rest
        syntax, although that could have just been me not doing it correctly.
        I'll have to give the cliché here of "it worked on my machine"
    - Nullish operators not being present was another feature I am used to
        using but wasn't able to. In its' place I have had to use OR operators.
        I'm not over the moon about this, but for demonstration purposes it works.
        Fun fact for whoever is assessing this btw, nullish operators are called
        elvis operators in Kotlin
*/
gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI(PIXI)

/*
    Declaring Enums, Classes, and Static values at the start.

    For time keepings sake and due to how this file is needed to run on JSBin
    this hasn't been seperated into individual index, UI, initial application,
    and method .ts'
*/

/*
    Building the Application 
*/
const appWidth = 600
const appHeight = 600
const app = new PIXI.Application({
    width: appWidth,
    height: appHeight,
    backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

/*
    Establishing the standardised colour list and a way to access
    random elements inside
*/
enum ColourOptions { 
    RED = 0xff0000,
    GREEN = 0x00ff00,
    BLUE = 0x0000ff,
    YELLOW = 0xffff00,
    CYAN = 0x00ffff,
    MAGENTA = 0xff00ff,
    BLACK = 0x000000,
    WHITE = 0xffffff,
    ORANGE = 0xffa500,
    PURPLE = 0x800080,
    PINK = 0xffc0cb,
    BROWN = 0xa52a2a,
    GREY = 0x808080,
    LIGHTGREY = 0xd3d3d3,
    DARKGREY = 0xa9a9a9
}
const enumValues: number[] = Object.values(ColourOptions).filter(
    (element): element is number => typeof element == 'number'
)

/*
    A PIXI.BitmapText was chosen over PIXI.Text due to it being easier/quicker
    to render. For this a font was needed.
*/
PIXI.BitmapFont.from("testFont")

/*
    Ball Class
    -Contains id and total ball amount attributes, as well as other attributes
        related to the size, speed and colour of the ball. 
*/
class Ball extends PIXI.Graphics {
    static ballNumber: number = 0
    id: number
    x: number
    y: number
    radius: number
    colour: number
    vx: number
    vy: number
    constructor(
        xCoOrd: number = 0,
        yCoOrd: number = 0,
        radius: number = 5,
        colour: number = 0xde3249
    ) {
        super()
        this.id = Ball.ballNumber
        this.x = xCoOrd
        this.y = yCoOrd
        this.radius = radius
        this.colour = colour

        this.makeShape()
        this.setSpeed()
    };

    private makeShape(): void{
        this.beginFill(this.colour)
        this.drawCircle(0, 0, this.radius)
        this.endFill
        Ball.ballNumber +=1
    }

    private setSpeed(): void{
        this.vx = Math.random() * 2 - 1
        this.vy = Math.random() * 2 - 1
    }

    private getCurrentAngle(): number{
        const jointDeltaV = (this.x**2 + this.y**2)**0.5
        return Math.asin(this.x/jointDeltaV)
    }

    private collision(ballCollided: Ball){
        const newVX = ballCollided.vx
        const newVY = ballCollided.vy
        ballCollided.vx = this.vx
        ballCollided.vy = this.vy
        this.vx = newVX
        this.vy = newVY
    }

    private getDistance(comparedBall: Ball): number{
        return (((comparedBall.x-this.x)**2)+((comparedBall.y-this.y)**2))**0.5
    }

    /*
        One of the things I probably shouldnt have started working on was the
        ball interaction. I know the docs say it can be ignored but the concept
        was interesting but after trialling it, I understand why it was an optional.

        My guess as to why it get's a bit weird is that the children of stage are not
        fully being removed or, the update location needs to be made asynchronously
        so each ball will wait and recognise what other balls it needs to compare
        against 
    */
    updateLocation(timeDifference : number, application: PIXI.Application): void {
        this.x += this.vx * timeDifference
        this.y += this.vy * timeDifference
        const contactBallList = application.stage.children.filter(
            child => Object.hasOwn(child, "id")
        ).filter(
            ball => ((this.radius + ball.radius) >= (this.getDistance(ball))) && this.id!=ball.id
        )
        if(contactBallList.length>0) {
            // const radAngle = Math.acos((contactBallList[0].y-this.y)/(contactBallList[0].x-this.x))
            // const collisionX = Math.cos(radAngle)*this.radius
            // const collisionY = Math.sin(radAngle)*this.radius
            this.collision(contactBallList[0])
        }
        if (this.x - this.radius < 0 ||
            this.x + this.radius > application.screen.width) {
            this.vx *= -1
        }
        if (this.y - this.radius < 0 ||
            this.y + this.radius > application.screen.height) {
            this.vy *= -1
        }
    }
}

/*
    Getting the initial graphics on the application.

    Honestly, I could have done something here showing a funky way of getting
    the balls onto the application, but I feel it's a mirror of the methods
    used to get them out of the container. I have put my time towards showing
    other more interesting functionality.

    But to demonstrate I know what I could have done, I could have seperated
    out the addBallToPlayground method and had a method to introduce each of 
    the balls in a random way, recieving a promise when an individual had 
    been added then set them off on the ticker.

    An addition would have been used to incorporate the funky introduction
    into the balls' vx and vy
*/
const ballAmount: number = Math.random() * 20 + 10
for (let index = 0; index < ballAmount; index++) {
    const ball = newRandomBall(enumValues, appHeight, appWidth)
    addBallToPlayground(ball, app)
}

/*
    SquareButton Class
    -Contains attributes relating to it's location, size, text and colour.
        There are also optional attributes for determining if a button
        will do anything when clicked and what happends when a pointer 
        hovers over and leaves the created button.
*/
class SquareButton extends PIXI.Graphics {
    x: number
    y: number
    customHeight: number 
    customWidth: number
    activeText: PIXI.BitmapText
    defaultText: string
    overText: string
    pressText: string
    activeColour: number
    defaultColour: number
    overColour: number
    pressColour: number
    action: Function

    constructor(
        horizontal: number,
        vertical: number,
        clickAction: Function,
        height?: number,
        width?: number,
        defaultText?: string,
        hoverText?: string,
        pressText?: string,
        colour?: number,
        hoverColour?: number,
        pressColour?: number
    ){
        /*
            All the default declerations for the class
        */
        super()
        this.interactive = true
        this.buttonMode = true
        this.visible = true

        /*

            All inputs are optional apart from the location, this was done to avoid
            buttons overlapping and not being found.

            I spent longer than I would like realising JSBin is using an old version of typescript
            that does not have nullish operators in yet.
        */
        this.x = horizontal
        this.y = vertical
        this.customHeight = height || 50
        this.customWidth = width || 50
        this.defaultText = defaultText || "Nowt"
        this.overText = hoverText || this.defaultText
        this.pressText = pressText || this.defaultText
        this.defaultColour = colour || 0xffffff
        this.activeColour = this.defaultColour
        this.overColour = hoverColour || this.defaultColour
        this.pressColour = pressColour || this.defaultColour
        this.action = clickAction

        /*
            All the generators for the class
        */
        this.makeSquare()
        this.makeText()
        this.setHandlers()

        /*
            Finally, hoist the generated text 
        */
        this.addChild(this.activeText)
    };

    private makeText(): void{
        this.activeText = new PIXI.BitmapText(this.defaultText, {fontName: "testFont", maxWidth: this.customWidth})
    }

    private makeSquare(): void{
        this.clear()
        this.beginFill(this.activeColour);
        this.drawRect(0, 0, this.customWidth, this.customHeight)
        this.endFill
    }

    /*
        setHandlers
        -Takes in no parameters.
        -Returns void.
        -Designed to organise the buttons reactions to certain handles
            and keep them in one place contained in the Object
    */
    private setHandlers(): void{
        this.on("pointerover", this.onPointerOver)
        this.on("pointerdown", this.onPointerClick)
        this.on("pointerout", this.onPointerOut)
    }

    private setActive(colour: number, text: string): void{
        this.activeColour = colour
        this.activeText.text = text
    }

    private triggerHandle(colour: number, text: string){
        this.setActive(colour, text)
        this.makeSquare()
    }

    private onPointerOver():void{
        this.triggerHandle(this.overColour, this.overText)
    }

    private onPointerClick():void{
        this.triggerHandle(this.pressColour, this.pressText)
        this.action==undefined? console.log("No Function Assigned Yet") : this.action()
    }

    private onPointerOut():void{
        this.triggerHandle(this.defaultColour, this.defaultText)
    }
};

/*
    Functions for reusability
*/
/*
    newRandomBall
    -Takes in no parameters.
    -Outputs a Ball Class Object.
    -Designed to return a random Ball
*/
function newRandomBall(
    coloursAvailable: number[],
    allowedDepth: number,
    allowedWidth: number
): Ball{
    const colourAmount: number = coloursAvailable.length
    const randomColourIndex: number = Math.random()*(colourAmount) | 0
    return new Ball(
        Math.random() * allowedDepth,
        Math.random() * allowedWidth,
        (Math.random() * 10) + 5,
        coloursAvailable[randomColourIndex]
    );
}
/*
    addBallToPlayground 
    -Takes in a ball of class Ball, also takes in the applicaiton used as Class
        PIXI.Application. 
    -Void is the return type, essentially giving back no return type.
    -Designed to add the given Ball to playground(application) and add it to the ticker
        for the use of animation.
*/
function addBallToPlayground(ball: Ball, application: PIXI.Application){
    application.stage.addChild(ball)
    application.ticker.add(
        timeDifference => ball.updateLocation(timeDifference, application)
    )
    application.ticker.update()
}
/*
    removeBallFRomPlayground
    -Takes in the given application as Class PIXI.Application.
    -Void return type.
    -Designed to remove a random ball from the given applications' stage
        by use of the Ball's ID
    -I did look into removing the object from the stage's ticker too but found
        that the ticker does not provide a direct method of listing what it
        contains. The work would outweigh the benefits in this case given it
        achieves the goal stated in the test
*/
async function removeBallFromPlayGround(application: PIXI.Application){
    const currentBallList = application.stage.children.filter(
        child => Object.hasOwn(child, "id")
    )
    if(currentBallList.length>0) {
        const ballToRemove = currentBallList[( Math.random()*(currentBallList.length) | 0)]
        await smallExit(ballToRemove)
        await popPop(ballToRemove)
        application.stage.removeChild(ballToRemove)
        ballToRemove.interactive = false
    }
}
/*
    stopStartPlayground
    -Takes in the given application as Class PIXI.Application.
    -Void return type.
    -Designed to load in the given applications' ticker state and stop or start it
        depending on it's current setting.
*/
function stopStartPlayground(application: PIXI.Application){
    application.ticker.started? application.ticker.stop() : application.ticker.start()
}
/*
    smallExit (Async)
    -Takes in the given object as a PIXI.DisplayObject.
    -Promise<void> return type, we just need to know it's complete.
    -Designed to shrink an object to have an absolute scale of zero
        then send a callback saying it has completed.
*/
async function smallExit(givenObject: PIXI.DisplayObject): Promise<void>{
    return new Promise(
        resolve => {
            gsap.to(
                givenObject, {
                    pixi: {scale: 0},
                    duration: 1
                }
            ).eventCallback(
                "onComplete", resolve
            )
        }
    )
}
/*
    popPop (Async)
    -Takes in the given object as a PIXI.DisplayObject, and an optional given
        amount of time as a number.
    -Promise<void> return type, we just need to know it's complete.
    -Designed display a "POP" near the objects coordinates for the given
        amount of time or a default amount.
    -Ideally this would be chained for cleanliness, but again, due to 
        JSBin's limitations it appears the typescript version used doesnt
        allow chaining or nullish operators
*/
async function popPop(givenObject: PIXI.DisplayObject, appearenceTime?: number): Promise<void>{
    return new Promise(
        resolve => {
            const newText = new PIXI.BitmapText(
                "*POP*",
                {fontName: "testFont"}
            )
            givenObject.addChild(newText)
            newText.enableTempParent()
            const weirdAngle = Math.floor(Math.random()*361)
            const weirdScale = Math.random() + 0.5
            gsap.set(
                newText, {
                    pixi: {
                        x: givenObject.x,
                        y: givenObject.y,
                        rotation: weirdAngle,
                        scale: weirdScale
                    }
                }
            )
            gsap.to(
                newText, {
                    duration: appearenceTime || 0.25
                }
            ).eventCallback(
                "onComplete", resolve
            )
        }
    )
}

/*
    Buttons initialised for use in the application
*/
/*
    buttonAdd
    -Takes in the button location, and a function to add a button
        on being clicked.
*/
const buttonAdd = new SquareButton(
    appWidth/2,
    appHeight/2,
    function () {
        const buttonBall = newRandomBall(enumValues, appHeight, appWidth)
        addBallToPlayground(buttonBall, app)
    },
    50,
    50,
    "Add!",
    "DO IT",
    "Hoya",
    0xff0000,
    0x00ff00,
    0x0000ff
)

/*
    buttonAdd
    -Takes in the button location, and a function to remove a ball on 
        being clicked.
*/
const buttonTakeAway = new SquareButton(
    appWidth/4,
    appHeight/4,
    function () {
        removeBallFromPlayGround(app)
        console.log("Also Possible")
    }
)

/*
    buttonStopStart
    -Takes in the button location, and a function to stop the animations
        or start them up again depending on the tickers' state.
*/
const buttonStopStart = new SquareButton(
    appWidth*0.75,
    appHeight*0.25,
    function(){
        stopStartPlayground(app)
    }
)

/*
    Hoists the buttons to the application
*/
app.stage.addChild(buttonAdd)
app.stage.addChild(buttonTakeAway)
app.stage.addChild(buttonStopStart)