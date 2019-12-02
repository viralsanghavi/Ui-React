

(function( $ ) {
   "use strict";

   $.fn.addRemoveTextbox = function( options ) {

      var settings = $.extend( {
         // A CSS class to style the 'Add' button.  The generated HTML will be a <span>, so it is
         // assumed that you will use CSS to define a background image.
         addButtonClass      : "addButton",

         // Hover text for the 'Add' button
         addButtonTooltip    : null,

         // A CSS class to style the 'Remove' button.  The generated HTML will be a <span>, so it is
         // assumed that you will use CSS to define a background image.
         removeButtonClass   : "removeButton",

         // Hover text for the 'Remove' button
         removeButtonTooltip : null,

         // A limit on the number of fields which may exist under the applicable ID prefix.  Default
         // is null (no limit).  If a value is specified, it must be an integer greater than 1.
         maxFields           : null,

         // If true, renumber the id and name attributes upon initialization and when a row is removed.
         // Renumbering is based on DOM order, not `id` or `name` values, and starts on the value
         // specified by `startingNumber`.  This setting is disabled by default because it can break
         // applications.  Be sure that your application can handle changing IDs and names before using this.
         contiguous          : false,

         // This setting is used only when 'contiguous' is set to true.
         startingNumber      : 0,

         // A callback function for add operations.  Your callback must accept two string arguments:
         // arg1:  the id attribute of the added row
         // arg2:  the name attribute of the added row
         addCallback         : null,

         // A callback function for remove operations.  Your callback must accept three string arguments:
         // arg1:  the id attribute of the removed row
         // arg2:  the name attribute of the removed row
         // arg3:  the value of the removed row
         removeCallback      : null
      }, options );

      if( this.length === 0 || this == null ) {
         throwException( "No matching field(s) found" );
      }

      var ID_PREFIX = this.attr( "id" ).replace( /\[?[0-9]*\]?$/, "" );
      var IS_NUMBERED_NOTATION = this.attr( "id" ).match( /[0-9]+$/ ) != null;
      var IS_ARRAY_NOTATION    = this.attr( "id" ).match( /\[[0-9]\]$/ ) != null;

      if( !IS_NUMBERED_NOTATION && !IS_ARRAY_NOTATION ) {
         throwException( "Invalid ID attribute '" + this.attr("id") + "': IDs must be nunmbered like id1, id2, or use array notation, like id[0], id[1]" );
      } else if( IS_NUMBERED_NOTATION && IS_ARRAY_NOTATION ) {
         throwException( "Invalid state: ID '" + this.attr("id") + "' notation not detected correctly" );  // should be impossible
      }

      if( settings.maxFields != null ) {
         var errMsg = "maxFields (" + settings.maxFields + ") must be an integer greater than 1";

         if( isNaN(settings.maxFields) ) {
            throwException( errMsg );
         } else {
            if( settings.maxFields < 2 || settings.maxFields % 1 !== 0 ) {
               throwException( errMsg );
            }

            settings.maxFields = parseInt( settings.maxFields );
         }
      }

      if( settings.contiguous === true ) {
         if( settings.startingNumber != null ) {
            var errMsg = "startingNumber (" + settings.startingNumber + ") must be an integer greater than or equal to 0";

            if( isNaN(settings.startingNumber) ) {
               throwException( errMsg );
            } else {
               if( settings.startingNumber < 0 || settings.startingNumber % 1 !== 0 ) {
                  throwException( errMsg );
               }

               settings.startingNumber = parseInt( settings.startingNumber );
            }
         }
      }

      init( this );

      function throwException( msg ) {
         throw "AddRemoveTextbox error:  " + msg;
      }

      function init( invokedBox ) {
         var fields = $( "input[id^='" + ID_PREFIX + "']" );

         if( settings.maxFields != null && fields.length > settings.maxFields ) {
            throwException( "There are more fields in the '" + ID_PREFIX + "' set (" + fields.length +
                            ") than are allowed by maxFields (" + settings.maxFields + ")" );
         }

         fields.each( function() {
            var inputField = $( this );
            var parentRow = inputField.parent();
            makeRemoveButton().insertAfter( inputField);
            if( parentRow.is(":last-child") ) {
               makeAddButton().appendTo( parentRow );
               
            }
         } );

         rebuild();
      }

      function makeButton( className, title ) {
         var btn = $( "<span></span>" );
         
         if( className != null ) {
            btn.addClass( className );
         }

         if( title != null ) {
            btn.attr( "title", title );
         }

         return btn;
      }

      function makeLabel( className, title ) {
         
         var lbl = $( "<label>"+ID_PREFIX+"</label>");
         return lbl;
      }

      function makeAddButton() {
         var btn = makeButton( settings.addButtonClass, settings.addButtonTooltip );

         btn.on( "click", function() {
            var newInputId = insertRow( $(this) );
            $( escape("#" + newInputId) ).focus();
         } );

         return btn;
      }

      function makeRemoveButton() {
         var btn = makeButton( settings.removeButtonClass, settings.removeButtonTooltip );

         btn.on( "click", function() {
            removeRow( $(this) );
         } );

         return btn;
      }

      function domScan() {
         var highestNumberedBox = null;
         var physicallyLastBox = null;

         var boxes = $( "input[id^='" + ID_PREFIX + "']" );

         boxes.each( function() {
            var jqThis = $( this );

            if( highestNumberedBox == null ) highestNumberedBox = jqThis;

            physicallyLastBox = jqThis;

            if( highestNumberedBox.attr("id") > jqThis.attr("id") ) {
               return;
            }

            highestNumberedBox = jqThis;
         } );

         return {
            highestBox : highestNumberedBox,
            lastBox    : physicallyLastBox,
            numBoxes   : boxes.length
         };
      }

      function insertRow( button ) {
         var lastRow = button.parent();
         var newRow = lastRow.clone( true );  // Passing 'true' so that the button click events are cloned
         var newInput = newRow.children( "input" );
         var newLabel = newRow.children( "label" );
         var nextIdResults = getNextId();

         newInput.val( "" );
         newInput.attr( "id", nextIdResults.nextId );
         newInput.attr( "name", newInput.attr("id") );

         newLabel.attr("for",nextIdResults.nextId);
         //newLabel.innerText(ID_PREFIX+nextIdResults.nextId);
         newLabel[0].innerHtml=nextIdResults.nextId;
         newLabel[0].innerText=nextIdResults.nextId;
       // newLabel.attr( "innerHtml", nextIdResults.nextId );
         button.remove();

         if( settings.maxFields != null && nextIdResults.numBoxes + 1 >= settings.maxFields ) {
            newRow.find( "span[class='" + settings.addButtonClass + "']" ).remove();
         }

         newRow.insertAfter( lastRow );

         if( typeof settings.addCallback === "function" ) {
            settings.addCallback( nextIdResults.nextId, nextIdResults.nextId );
         }

         return nextIdResults.nextId;
      }

      function getNextId() {
         var domScanResults = domScan();

         if( settings.maxFields != null && domScanResults.numBoxes >= settings.maxFields ) {
            throwException( "Field count limit reached for " + ID_PREFIX );
         }

         var highestBox = domScanResults.highestBox;
         //var highestNum = parseInt( highestBox.attr("id").replace(/.*(\d+).*$/, "$1") );
         var highestNum = parseInt( highestBox.attr("id").replace(/([^\d]*)(\d*)([^\w]*)/, "$2") );
         var nextNum = highestNum + 1;

         var nextId = IS_ARRAY_NOTATION ? ID_PREFIX + "[" + nextNum + "]"
                                        : ID_PREFIX + nextNum;

         return {
            nextId   : nextId,
            numBoxes : domScanResults.numBoxes
         };
      }

      function removeRow( button ) {
         var rowToRemove = button.parent();
         var prevRow = rowToRemove.prev();
         var inputToRemove = rowToRemove.children( "input" );
         var inputToRemoveVal = inputToRemove.val();
         var inputId = inputToRemove.attr( "id" );
         var inputName = inputToRemove.attr( "name" );

         // Don't remove the row if it's the only/last one in the group.

         var othersExist = false;

         $( "input[id^='" + ID_PREFIX + "']" ).each( function() {
            if( $(this).attr("id") !== inputId ) {
               othersExist = true;
               return;
            }
         } );

         if( othersExist ) {
            if( rowToRemove.is(":last-child") ) {
               makeAddButton().appendTo( prevRow );
            } else {
               if( !rowToRemove.parent().last().find("span[class='" + settings.addButtonClass + "']").length ) {
                  makeAddButton().appendTo( rowToRemove.siblings(":last") );
               }
            }

            rowToRemove.remove();
            rebuild();
         } else {
            inputToRemove.val( "" );
         }

         if( typeof settings.removeCallback === "function" ) {
            settings.removeCallback( inputId, inputName, inputToRemoveVal );
         }
      }

      function rebuild() {
         if( settings.contiguous === true ) {
            var currNum = settings.startingNumber;

            $( "input[id^=" + ID_PREFIX + "]" ).each( function() {
               var field = $(this);
               var newId = IS_ARRAY_NOTATION ? ID_PREFIX + "[" + currNum + "]"
                                             : ID_PREFIX + currNum;
               field.attr( "id", newId );
               field.attr( "name", newId );

               currNum++;
            } );
         }
      }

      function escape( selector ) {
         return selector.replace( /(\[|\])/g, "\\$1" );
      }
   };
}( jQuery ));
