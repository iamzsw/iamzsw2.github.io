(function(window, undefined) {
				
	var Page	= (function() {
	
		var $container			= $( '#hs-container' ),
			// the scroll container that wraps the articles
			$scroller			= $container.find( 'div.hs-content-scroller' ),
			$menu				= $container.find( 'aside' ),
			// menu links
			$links				= $menu.find( 'nav > a' ),
			$articles			= $container.find( 'div.hs-content-wrapper > article' ),
			// button to scroll to the top of the page
			// only shown when screen size < 715
			$toTop				= $container.find( 'a.hs-totop-link' ),
			// the browser nhistory object
			History 			= window.History,
			// animation options
			animation			= { speed : 800, easing : 'easeInOutExpo' },
			// jScrollPane options
			scrollOptions		= { verticalGutter : 0, hideFocus : true },
			// init function
			init				= function() {
				
				// initialize the jScrollPane on both the menu and articles
				_initCustomScroll();
				// initialize some events
				_initEvents();
				// sets some css properties 
				_layout();
				// jumps to the respective chapter
				// according to the url
				_goto();
				
			},
			_initCustomScroll	= function() {
				
				// Only add custom scroll to articles if screen size > 715.
				// If not the articles will be expanded
				if( $(window).width() > 715 ) {
				
					$articles.jScrollPane( scrollOptions );
				
				}
				// add custom scroll to menu
				$menu.children( 'nav' ).jScrollPane( scrollOptions );
			
			},
			_goto				= function( chapter ) {
				
					// get the url from history state (e.g. chapter=3) and extract the chapter number
				var chapter 	= chapter || History.getState().url.queryStringToJSON().chapter,
					isHome		= ( chapter === undefined ),
					// we will jump to the introduction chapter if theres no chapter
					$article 	= $( chapter ? '#' + 'chapter' + chapter : '#' + 'introduction' );
				
				if( $article.length ) {
				
						// left / top of the element
					var left		= $article.position().left,
						top			= $article.position().top,
						// check if we are scrolling down or left
						// is_v will be true when the screen size < 715
						is_v		= ( $(document).height() - $(window).height() > 0 ),
						// animation parameters:
						// if vertically scrolling then the body will animate the scrollTop,
						// otherwise the scroller (div.hs-content-scroller) will animate the scrollLeft
						param		= ( is_v ) ? { scrollTop : (isHome) ? top : top + $menu.outerHeight( true ) } : { scrollLeft : left },
						$elScroller	= ( is_v ) ? $( 'html, body' ) : $scroller;
					
					$elScroller.stop().animate( param, animation.speed, animation.easing, function() {
						
						// active class for selected chapter
						$articles.removeClass( 'hs-content-active' );
						$article.addClass( 'hs-content-active' );
						
					} );
				
				}
			
			},
			_saveState			= function( chapter ) {
			
				// adds a new state to the history object
				// this will trigger the statechange on the window
				if( History.getState().url.queryStringToJSON().chapter !== chapter ) {
						
					History.pushState( null, null, '?chapter=' + chapter );
				
				}
			
			},
			_layout				= function() {
			
				// control the overflow property of the scroller (div.hs-content-scroller)
				var windowWidth	= $(window).width();
				switch( true ) {
				
					case ( windowWidth <= 715 ) : $scroller.scrollLeft( 0 ).css( 'overflow', 'visible' ); break;
					case ( windowWidth <= 1024 ): $scroller.css( 'overflow-x', 'scroll' ); break;
					case ( windowWidth > 1024 ) : $scroller.css( 'overflow', 'hidden' ); break;
				
				};
			
			},
			_initEvents			= function() {
				
				_initWindowEvents();
				_initMenuEvents();
				_initArticleEvents();
				
			},
			_initWindowEvents	= function() {
			
				$(window).on({
					// when resizing the window we need to reinitialize or destroy the jScrollPanes
					// depending on the screen size
					'smartresize' : function( event ) {
						
						_layout();
						
						$('article.hs-content').each( function() {
							
							var $article 	= $(this),
								aJSP		= $article.data( 'jsp' );
							
							if( $(window).width() > 715 ) {
								
								( aJSP === undefined ) ? $article.jScrollPane( scrollOptions ) : aJSP.reinitialise();
								
								_initArticleEvents();
								
							}	
							else {
								
								// destroy article's custom scroll if screen size <= 715px
								if( aJSP !== undefined )
									aJSP.destroy();
								
								$container.off( 'click', 'article.hs-content' );
								
							}
							
						});
						
						var nJSP = $menu.children( 'nav' ).data( 'jsp' );
						nJSP.reinitialise();
						
						// jumps to the current chapter
						_goto();
					
					},
					// triggered when the history state changes - jumps to the respective chapter
					'statechange' : function( event ) {
						
						_goto();
					
					}
				});
			
			},
			_initMenuEvents		= function() {
			
				// when we click a menu link we check which chapter the link refers to,
				// and we save the state on the history obj.
				// the statechange of the window is then triggered and the page/scroller scrolls to the 
				// respective chapter's position
				$links.on( 'click', function( event ) {
					
					var href		= $(this).attr('href'),
						chapter		= ( href.search(/chapter/) !== -1 ) ? href.substring(8) : 0;
					
					_saveState( chapter );
					
					return false;
				
				});
			
				// scrolls to the top of the page.
				// this button will only be visible for screen size < 715
				$toTop.on( 'click', function( event ) {
					
					$( 'html, body' ).stop().animate( { scrollTop : 0 }, animation.speed, animation.easing );
					
					return false;
				
				});
			
			},
			_initArticleEvents	= function() {
			
				// when we click on an article we check which chapter the article refers to,
				// and we save the state on the history obj.
				// the statechange of the window is then triggered and the page/scroller scrolls to the 
				// respective chapter's position
				$container.on( 'click', 'article.hs-content', function( event ) {
					
					var id			= $(this).attr('id'),
						chapter		= ( id.search(/chapter/) !== -1 ) ? id.substring(7) : 0;
					
					_saveState( chapter );
					
					return false;
				
				});
			
			};
			
		return { init : init };	
	
	})();
	
	Page.init();
	
})(window);

var plate=document.getElementById('plate');
var needles=document.getElementById('needles');
needles.setAttribute('style','position:absolute;top:8px;left:8px;');  //这里因为chrome里面，body的magin值为8px，所以我这里就没设为0了。
var cntP=plate.getContext('2d');
var cntH=needles.getContext('2d');
plate.width=10;
plate.height=10;
needles.width=500;
needles.height=400;

function drawclock(cnt,radius,platelen,linewidth,numLen,NUMLEN){
            this.cnt=cnt;
            this.radius=radius;
            this.platelen=platelen;
            this.linewidth=linewidth;
            this.numLen=numLen;
            this.NUMLEN=NUMLEN;
            this.getCalibCoor=function(i){  
                //获得表盘刻度两端的坐标
               
            };
            this.drawCalibration=function(){ //画刻度
               
            };
        }
　　　　　　
			
			
	function clockNeedle(cnt,R,lineWidth,strokeStyle,lineCap,obj){
            this.R=R;
            this.cnt=cnt;
            this.lineWidth=lineWidth;
            this.strokeStyle=strokeStyle;
            this.lineCap=lineCap;
            this.obj=obj;
            this.getNeedleCoor=function(i){
                var X=200+this.R*0.8*Math.sin(i); //起点的坐标
                var Y=200-this.R*0.8*Math.cos(i);

                var x=200-20*Math.sin(i); //终点的坐标
                var y=200+20*Math.cos(i);
                return {X:X,Y:Y,x:x,y:y};
            };
            this.drawNeedle=function(){
                var d=new Date().getTime();
                var angle;
                switch(this.obj){
                    case 0:
                    angle=(d/3600000%24+8)/12*360*Math.PI/180;
                    break;
                    case 1:
                    angle=d/60000%60/60*360*Math.PI/180;
                    break;
                    case 2:
                    angle=d/1000%60/60*360*Math.PI/180;
                    break;
                }
                var coorobj=this.getNeedleCoor(angle);
                this.cnt.beginPath();
                this.cnt.moveTo(coorobj.x,coorobj.y);
                this.cnt.lineTo(coorobj.X,coorobj.Y);
                // this.cnt.closePath();

                this.cnt.lineWidth=this.lineWidth;
                this.cnt.strokeStyle=this.strokeStyle;
                this.cnt.lineCap=this.lineCap;
                this.cnt.stroke();
            }
        }
		
		function draw(){
            cntH.clearRect(0,0,needles.width,needles.height);
            var mzneedle=new clockNeedle(cntH,200,1,'rgba(0,0,0,.5)','round',2);
            //最后一个参数0代表画时针，1画分针，2画秒针
            var fzneedle=new clockNeedle(cntH,80,3,'rgba(0,0,0,.4)','round',0);
            var szneedle=new clockNeedle(cntH,140,2,'rgba(0,0,0,.3)','round',1);
            mzneedle.drawNeedle();
            fzneedle.drawNeedle();
            szneedle.drawNeedle();
            cntH.arc(200,200,5,0,2*Math.PI);
            cntH.fillStyle='rgba(0,0,0,.5)';
            cntH.fill();
 }
 setInterval(draw,1);