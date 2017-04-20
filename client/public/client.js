(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Keyboard={game:null,keyDownHandler(a){switch(a.keyCode){case 40:console.log('down');break;case 37:Keyboard.game.truck.direction=-1,Keyboard.game.move=!0;break;case 39:Keyboard.game.truck.direction=1,Keyboard.game.move=!0;break;case 38:console.log('up');break;case 32:null===Keyboard.game.gameLoop?Keyboard.game.start():Keyboard.game.stop();break;default:console.log(a.keyCode);}},keyUpHandler(){},bind(a){a.addEventListener('keydown',this.keyDownHandler),a.addEventListener('keyup',this.keyUpHandler)},release(a){a.removeEventListener('keydown',this.keyDownHandler),a.removeEventListener('keyup',this.keyUpHandler)}};module.exports=Keyboard;

},{}],2:[function(require,module,exports){
const templates=require('./Templates');class Layer{constructor(a,b=1){this.containerElement=a,this.scrollFactor=b,this.width=this.containerElement.offsetWidth,this.initialOffset=this.containerElement.offsetLeft,this.currentOffset=this.initialOffset,this.nextOffset=this.currentOffset,this.dynamicObjects=[],this.activeObjects=[]}update(){let a=this.width+this.currentOffset;this.ensureChunk(a,a+4e3)}ensureChunk(a,b){for(let c of this.dynamicObjects)c.currentOffset<a||c.currentOffset>b||this.add(c);this.generatePosts(a,b,200)}add(a){a.active=!0,this.activeObjects.push(a),this.containerElement.appendChild(a.element)}remove(a){a.active=!1,console.log(this.activeObjects.indexOf(a)),console.log(this.dynamicObjects.indexOf(a)),this.containerElement.removeChild(a)}addDynamic(a){return'undefined'!=typeof a.x&&'undefined'!=typeof a.element&&void this.dynamicObjects.push(a)}scroll(a){this.nextOffset+=a*this.scrollFactor;let b=Math.round(this.nextOffset);this.currentOffset===b||(this.currentOffset=b,this.nextOffset=this.currentOffset,this.containerElement.style.left=this.currentOffset+'px')}generatePosts(a,b,c){for(let e,d=a;d<b;d+=c)e=templates.get('post'),e.style.left=d+'px',this.containerElement.appendChild(e)}rand(a,b){return Math.ceil(Math.random()*(b-a))+a}generateClouds(a,b){for(let e,d=a;d<b;d+=this.rand(200,500))e=templates.get('cloud'),e.style.left=d+'px',e.style.bottom=this.rand(200,400)+'px',e.style.width=this.rand(100,250)+'px',e.style.height=this.rand(40,80)+'px',this.containerElement.appendChild(e)}}module.exports=Layer;

},{"./Templates":3}],3:[function(require,module,exports){
const Templates={containerElement:null,templates:{},load(a){this.containerElement=a;for(let b of this.containerElement.children){let c=b.className;if('undefined'!=typeof this.templates[c])throw Error(`Template error: cannot load "${c}" twice!`);this.templates[c]=b}},get(a){if(null===this.containerElement)throw Error('Template error: no templates loaded');if('undefined'==typeof this.templates[a])throw Error(`Argument error: template "${a}" not found`);return this.templates[a].cloneNode(!0)}};module.exports=Templates;

},{}],4:[function(require,module,exports){
class Truck{constructor(a){this.containerElement=a,this.svg=this.containerElement.querySelector('svg'),this.width=100,this.initialOffset=20100,this.currentOffset=this.initialOffset,this.speed=5,this._x=0,this._direction=1}set x(a){this.currentOffset=this.initialOffset+a,this.containerElement.style.left=this.currentOffset+'px',this._x=a}get x(){return this._x}set direction(a){this._direction!==a&&this.svg.setAttribute('style','transform: scaleX('+a+'); transition: .1s'),this._direction=a}get direction(){return this._direction}move(a){this.x+=a}get element(){return this.containerElement}isWithin(a,b){return this.currentOffset>a&&this.currentOffset+this.width<b}}module.exports=Truck;

},{}],5:[function(require,module,exports){
Object.resolve=function(a,b){return a.split('.').reduce(function(c,d){return c?c[d]:void 0},b||self)};class UserInterface{constructor(a,b){this.containerElement=a,this.stateContainer=b,this.hudContainer=this.containerElement.querySelector('#hud'),this.valueContainer=this.hudContainer.querySelector('ul'),this.hudContainer.querySelector('#playerName').innerHTML='Player Name',this.hudValues=[{label:'position',val:'truck.x'}],this.updateInterval=200,this.lastUpdate=-this.updateInterval,this.render(0)}render(a){if(this.lastUpdate>a-this.updateInterval)return;let b='';for(let c in this.hudValues){let d=this.hudValues[c];b+=`${d.label}: ${Object.resolve(d.val,this.stateContainer)}`}this.valueContainer.innerHTML=b,this.lastUpdate=a}}module.exports=UserInterface;

},{}],6:[function(require,module,exports){
const UserInterface=require('./UserInterface'),Truck=require('./Truck'),Keyboard=require('./Keyboard'),Layer=require('./Layer'),templates=require('./Templates');var game={debug:!1,move:!0,layer:null,layer2:null,currentOffset:null,viewportWidth:null,viewPortPadding:100,init:function(){templates.load(document.querySelector('#templates'));let a=document.querySelector('#layer-0');game.layer=new Layer(a);let b=document.querySelector('#layer-2');game.layer2=new Layer(b,.04),game.layer2.generateClouds(0,1e4);let c=templates.get('truck');c.id='user1',game.truck=new Truck(c),game.layer.addDynamic(game.truck),game.layer.update();let d=document.querySelector('#layer-ui');game.ui=new UserInterface(d,this),Keyboard.bind(window),Keyboard.game=this,game.viewportWidth=window.innerWidth,game.currentOffset=game.layer.currentOffset,game.bindResize()},bindResize:function(){window.addEventListener('resize',function(){game.viewportWidth=window.innerWidth,console.log(game.viewportWidth)})},scroll:function(a){game.layer.scroll(a),game.layer2.scroll(a),game.currentOffset=game.layer.currentOffset},afStep:function(a){if(!0===game.debug){console.log('frametime:',a-game.afTs);var b=performance.now()}if(game.afTs=a,game.ui.render(a),!0===game.move){game.truck.move(game.truck.direction*game.truck.speed);let c=-game.currentOffset+game.viewPortPadding,d=-game.currentOffset+game.viewportWidth-game.viewPortPadding;game.truck.isWithin(c,d)||game.scroll(-game.truck.direction*game.truck.speed)}!0===game.debug&&console.log('step time:',performance.now()-b),game.afCallback=window.requestAnimationFrame(game.afStep)},update:function(){},gameLoopInterval:20,gameLoop:null,afCallback:null,afTs:null,start:function(){window.cancelAnimationFrame(game.afCallback),clearInterval(game.gameLoop),game.gameLoop=setInterval(game.update,game.gameLoopInterval),game.afCallback=window.requestAnimationFrame(game.afStep)},stop:function(){window.cancelAnimationFrame(game.afCallback),clearInterval(game.gameLoop),game.afCallback=null,game.gameLoop=null}};window.addEventListener('DOMContentLoaded',function(){game.init(),game.start()});

},{"./Keyboard":1,"./Layer":2,"./Templates":3,"./Truck":4,"./UserInterface":5}]},{},[6]);
