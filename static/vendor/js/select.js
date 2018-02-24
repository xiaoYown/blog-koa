/*
 * Version: 1.0.0
 * Author: xioYown 
 * Updated: 2018-02-24 22:57:38
*/
/**
 * options Object
 * el: select wrap
 *
 */
var Xyselect = function(options){
	this.el = options.el;

}

Xyselect.prototype = (function( global ){

	return {

	}

})( typeof window !== "undefined" ? window : this );

if ( typeof define === "function" && define.amd ) {
	define( "Xyselect", [], function() {
		return Xyselect;
	} );
}

window.Xyselect = Xyselect;