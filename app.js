$(function($) {
$log                = true;
$newPosition        = 0;
$oldChildPosition   = 0;
$oldParentPosition  = 0;
$freeMoveMode       = false;
$oldColor           = 0;
$oldDirection       = 0;
$oldIdentity        = 0;
$oldPosition        = 0;
var OldCoords       = [];
var Processed       = 1;
$markerControl      = false;
var ii = 0;
// setInterval(function(){
//   //console.log("test  "+ii);
//   console.log(".block[data-id='7']:eq("+ii+")");
//   $(document).find(".block[data-id='7']:eq("+ii+")").click();
//   ii++;
//   if(ii==8){
//     ii = 0;
//   }
//
// },150);
// OldCoords["a1"] = [];
// OldCoords["b1"] = [];
// OldCoords["c1"] = [];
// OldCoords["d1"] = [];
// OldCoords["e1"] = [];
// OldCoords["f1"] = [];
// OldCoords["g1"] = [];
// OldCoords["h1"] = [];
// OldCoords["a2"] = [];
// OldCoords["b2"] = [];
// OldCoords["c2"] = [];
// OldCoords["d2"] = [];
// OldCoords["e2"] = [];
// OldCoords["f2"] = [];
// OldCoords["g2"] = [];
// OldCoords["h2"] = [];
// OldCoords["a7"] = [];
// OldCoords["b7"] = [];
// OldCoords["c7"] = [];
// OldCoords["d7"] = [];
// OldCoords["e7"] = [];
// OldCoords["f7"] = [];
// OldCoords["g7"] = [];
// OldCoords["h7"] = [];
// OldCoords["a8"] = [];
// OldCoords["b8"] = [];
// OldCoords["c8"] = [];
// OldCoords["d8"] = [];
// OldCoords["e8"] = [];
// OldCoords["f8"] = [];
// OldCoords["g8"] = [];
// OldCoords["h8"] = [];

// logging
function status($str,$force=false){
    if($log || $force){
      $(".status").prepend($str);
      $(".status").prepend("<br>---------------------<br>");
    }
}
function cstatus($str,$force=false){
  if($log || $force){
    console.log($str);
  }
}
$(".ClearLog").click(function(){
  $(".status").html("");
});
$(".EnableNumbering").click(function(){
  if($numberMode){
    $numberMode = false;
    $(this).html("Off");
  }else{
    $numberMode = true;
    $(this).html("On");
  }
});
$(".MarkerControl").click(function(){
  if($markerControl){
    $markerControl = false;
    $(this).html("Off");
  }else{
    $markerControl = true;
    $(this).html("On");
  }
});


// $.each(["addClass","removeClass"],function(i,methodname){
//       var oldmethod = $.fn[methodname];
//       $.fn[methodname] = function(){
//             oldmethod.apply( this, arguments );
//             this.trigger(methodname+"change");
//             $(".block[data-]")
//             return this;
//       }
// });

//** Functions
function highlight($line,$position){
  $(".block[data-id='"+$line+"'][data-child='"+$position+"']").addClass("range marked");
}
function removeHighlight($id){
  $(".old_"+$id+"_marker[data-sub]").each(function(){
    if($(this).attr("data-sub")!=1){
      $(this).attr("data-sub",parseInt($(this).attr("data-sub")-1));
    }else{
      $(this).removeAttr("data-sub");
    }
  });
  $(".old_"+$id+"_marker").not("[data-sub]").removeClass("marker_"+$id+" marker_"+$id+"_top_left \
   marker_"+$id+"_top_right old_"+$id+"_marker marker_"+$id+"_up marker_"+$id+"_down marker_"+$id+"_bottom_left marker_"+$id+"_bottom_left_right marker_"+$id+"_top marker_"+$id+"_bottom marker_"+$id+"_left marker_"+$id+"_right ");

}
$fnOldLine      = 0;
$fnOldPosition  = 0;
$fnNewLine      = 0;
$fnNewPosition  = 0;
  $.fn.setChild = function(position){
    var settings = $.extend({}, position);
    var tempLine = this.find(".block[data-child='"+position[0]+"']");
    var tempID   = this.find("img").attr("data-id");
    var line     = this.attr("data-row");
    if(tempID!=position[1] || tempLine.find("img").length==0){
      tempLine.addClass(position[2]);
    }else{
      //tempLine.addClass(position[2]);
    }
    //console.log(settings);
    return tempLine;
  }
  $.expr[':'].likeClass = function(match){
      return $('[class*=" '+ match +'"]');
};

//Ranges
// Placing
function ProcessPlacing($oldPosition,$oldLine, $newPosition,$newLine){
  $(".line[data-row='"+$newLine+"'] .block[data-id='"+$newLine+"'][data-child='"+$newPosition+"']").html($(".line[data-row='"+$oldLine+"']").find(".block[data-id='"+$oldLine+"'][data-child='"+$oldPosition+"'] img")[0]).addClass("selected");
  $(".line[data-row='"+$oldLine+"']").find(".block[data-id='"+$oldLine+"'][data-child='"+$oldPosition+"'] img").remove();
  $(".block").removeClass("range");
}
function ProcessRange($parent,$child,$line,$direction,$color,$identity,$position,$marker=true){
  $identity  = $identity.toLowerCase();
  var line   = $(".line[data-row='"+$parent+"']");
  var block  = $(".block[data-child='"+$child+"'][data-id='"+$parent+"']");
  $id        = block.find("img").attr("data-unique");

  if($markerControl){
    $marker = false;
  }else{
    $marker = $marker;
  }
  if($marker){
    $ranger = "range"; // <-- highlights the visible move
  }else{
      $ranger = "marker_"+$id;
  }
    if(line.prev().length>0){
        if($direction=="up"){
          $newLinePosition = line.prev().attr("data-row");
          var newPawnLine  = line.prev();
        }else{
          var newPawnLine  = line.next();
          $newLinePosition = line.next().attr("data-row");
        }
      // ** Start Pawn **/
      if($identity=="pawn"){
        if(newPawnLine.attr("data-breakdown")!=$position){
          $loop = 1;
        }else{
          $loop = 2;
        }
        $i = 1;
        $newTempLineForPawn = newPawnLine;
        while($i<=$loop){
          if($newTempLineForPawn.find(".block[data-child='"+$child+"'] img").attr("data-id")!=$position || $newTempLineForPawn.find(".block[data-child='"+$child+"'] img").length==0){

              // straight
              if($newTempLineForPawn.find(".block[data-child='"+$child+"'] img").length==0){
                if($i==$loop && $marker==false){
                  $newTempLineForPawn.find(".block[data-child='"+$child+"']").addClass($ranger+" marker_"+$id+"_"+$direction).attr("data-sub",2);
                }else{
                  $newTempLineForPawn.find(".block[data-child='"+$child+"']").addClass($ranger+" marker_"+$id+"_"+$direction).attr("data-sub",1);
                }
              }
              // side
              // if the close breaker exist, the marker loop is on down side. otherwise it is up.
              // right
              $child = parseInt($child);
              var rightPawnBlock = $newTempLineForPawn.find(".block[data-child='"+parseInt($child+1)+"']");
              var leftPawnBlock = $newTempLineForPawn.find(".block[data-child='"+parseInt($child-1)+"']");
              if(newPawnLine.attr("data-breakdown")==$position){
                if($i<$loop || rightPawnBlock.find("img").length==1 || leftPawnBlock.find("img").length==1){
                  if(rightPawnBlock.find("img").length==1 || $marker==false){
                    $newTempLineForPawn.find(".block[data-child='"+parseInt($child+1)+"']").addClass($ranger+" marker_"+$id+"_right");
                  }
                  if(leftPawnBlock.find("img").length==1 || $marker==false){
                    $newTempLineForPawn.find(".block[data-child='"+parseInt($child-1)+"']").addClass($ranger+" marker_"+$id+"_left");
                  }
                }
              }else{
                if($i==$loop || rightPawnBlock.find("img").length==1 || leftPawnBlock.find("img").length==1){
                  if(rightPawnBlock.find("img").length==1 || $marker==false){
                    $newTempLineForPawn.find(".block[data-child='"+parseInt($child+1)+"']").addClass($ranger+" marker_"+$id+"_right");
                  }
                  if(leftPawnBlock.find("img").length==1 || $marker==false){
                    $newTempLineForPawn.find(".block[data-child='"+parseInt($child-1)+"']").addClass($ranger+" marker_"+$id+"_left");
                  }
                }
              }

            if($direction=="up"){
                if($newTempLineForPawn.prev().find(".block[data-child='"+$child+"'] img").attr("data-id")!=$position && $newTempLineForPawn.find(".block[data-child='"+$child+"'] img").length==1){
                  break;
                }
              }else{
                if($newTempLineForPawn.next().find(".block[data-child='"+$child+"'] img").attr("data-id")!=$position && $newTempLineForPawn.find(".block[data-child='"+$child+"'] img").length==1){
                  break;
                }
              }
          }else{
            break;
          }
          if($direction=="up"){
            $newTempLineForPawn  = $newTempLineForPawn.prev();
          }else{
            $newTempLineForPawn  = $newTempLineForPawn.next();
          }
          $i++;
        }
        if($direction=="down"){
          if(parseInt(8-$parent)){
            // white
            $(".dailoger").removeClass("dailoger");
            $(".dailog").find("li.queen").html($("img[data-unique='d1']").parent().html());
            $(".dailog").find("li.rook").html($("img[data-unique='a1']").parent().html());
            $(".dailog").find("li.bishop").html($("img[data-unique='c1']").parent().html());
            $(".dailog").find("li.knight").html($("img[data-unique='b1']").parent().html());
            $("img[data-unique='"+$id+"']").parent().addClass("PawnChanger");
            console.log($("img[data-unique='"+$id+"']"));
          }
        }else{
          if(parseInt($parent-1)==0){
            alert("Change black "+$id);
          }
        }

      }
      //** End Pawn **/
    }

  //** Start Bisop **/
  if($identity=="bishop"){
    var linesOnTop  = line.prevAll().length;
    var linesOnBottom  = line.nextAll().length;
    $parent = parseInt($parent);
    // Line top Left
    $TopLeftchild = parseInt($child);
    for(i=linesOnTop;i>=1;i--){
        $TopLeftchild = $TopLeftchild + 1;
        var tempBishopLine = $(".line[data-row='"+i+"'] .block[data-child='"+$TopLeftchild+"']");
        if(tempBishopLine.find("img").attr("data-id")!=$position || tempBishopLine.find("img").length==0){
          tempBishopLine.addClass($ranger+" marker_"+$id+"_top_left");
          if(tempBishopLine.find("img").attr("data-id")!=$position && tempBishopLine.find("img").length==1){
            break;
          }
        }else{
          break;
        }
    }
    //Line top Right
    $TopRightchild = parseInt($child);
    for(i=linesOnTop;i>=1;i--){
        $TopRightchild = $TopRightchild - 1;
        var tempBishopLine = $(".line[data-row='"+i+"'] .block[data-child='"+$TopRightchild+"']");
        if(tempBishopLine.find("img").attr("data-id")!=$position || tempBishopLine.find("img").length==0){
          tempBishopLine.addClass($ranger+" marker_"+$id+"_top_right");
          if(tempBishopLine.find("img").attr("data-id")!=$position && tempBishopLine.find("img").length==1){
            break;
          }
        }else{
          break;
        }
    }
    // Bottom Left
    $BottomLeftchild = parseInt($child)-1;
    //console.log($parent+"<=8");
    for(var x=$parent;x<=8;x++){
        // console.log($ranger+":::"+x);
        $BottomLeftchild = $BottomLeftchild + 1;
        if(x!=$parent){
          // console.log($ranger+":::"+x);
          var tempBishopLine = $(".line[data-row='"+x+"'] .block[data-child='"+$BottomLeftchild+"']");
          // console.log(tempBishopLine);
          if(tempBishopLine.find("img").attr("data-id")!=$position || tempBishopLine.find("img").length==0){
            // console.log($ranger+":::"+x+" adding");
            tempBishopLine.addClass($ranger+" marker_"+$id+"_bottom_left");
            if(tempBishopLine.find("img").attr("data-id")!=$position && tempBishopLine.find("img").length==1){
              break;
            }
          }else{
            break;
          }
        }
    }
    // Bottom Right
    $BottomRightchild = parseInt($child)+1;
    for(i=$parent;i<=8;i++){
        $BottomRightchild = $BottomRightchild - 1;
        if(i!=$parent){
          var tempBishopLine =  $(".line[data-row='"+i+"'] .block[data-child='"+$BottomRightchild+"']");
          if(tempBishopLine.find("img").attr("data-id")!=$position || tempBishopLine.find("img").length==0){
            tempBishopLine.addClass($ranger+" marker_"+$id+"_bottom_right");
            if(tempBishopLine.find("img").attr("data-id")!=$position && tempBishopLine.find("img").length==1){
              break;
            }
          }else{
            break;
          }
        }
    }
  }
  //** End Bisop **/
  //** Start Knight **/
 if($identity=="knight"){
   var knightLine  = line; //<-- position where the knight is
   var x    = 2;
   var loop = 1;
   //console.log($ranger);
   while(loop<=2){          //<-- loop for line above
      var knightParent = knightLine.next().attr("data-row");
      knightLine.prev().setChild([parseInt($child)+x,$position,$ranger+" marker_"+$id+"_top_right",knightLine.prev().attr("data-row")]); // 0 0 0 0 X
      knightLine.prev().setChild([parseInt($child)-x,$position,$ranger+" marker_"+$id+"_top_left",knightLine.prev().attr("data-row")]); // X 0 0 0 X
      knightLine = knightLine.prev();
      x = x-1;
      loop=loop+1;
   }
  var knightLine  = line; //<-- position where the knight is
   var x    = 2;
   var loop = 1;
   while(loop<=2){          //<-- loop for line below
      var knightParent = knightLine.next().attr("data-row");
      knightLine.next().setChild([parseInt($child)+x,$position,$ranger+" marker_"+$id+"_bottom_right",knightLine.next().attr("data-row")]); // 0 0 0 X 0
      knightLine.next().setChild([parseInt($child)-x,$position,$ranger+" marker_"+$id+"_bottom_left",knightLine.next().attr("data-row")]); // 0 X 0 X 0
      knightLine = line.next();
      x = x-1;
      loop=loop+1;
   }
 }
  //** End Knight **/
  //** Start King **/
  if($identity=="king"){
    var kingLine = line;
      kingLine.setChild([parseInt($child)+1,$position,$ranger]);
      kingLine.setChild([parseInt($child)-1,$position,$ranger]);
      for(var i=0;i<=1;i++){
        if(i!=0){
          kingLine.prev().setChild([parseInt($child)+i,$position,$ranger]);
          kingLine.prev().setChild([parseInt($child)-i,$position,$ranger]);
          kingLine.next().setChild([parseInt($child)+i,$position,$ranger]);
          kingLine.next().setChild([parseInt($child)-i,$position,$ranger]);
        }else{
          kingLine.prev().setChild([parseInt($child),$position,$ranger]);
          kingLine.next().setChild([parseInt($child),$position,$ranger]);
        }
      }
  }
  //** End King **/
  //** Start Rook **/
  if($identity=="rook"){
      var rookLineTop   = line;
      //Line Down for rook
      for(var j=1;j<=rookLineTop.nextAll().length;j++){
        var tempLineDown = $(".line[data-row='"+ parseInt(parseInt($parent)+parseInt(j)) +"'] .block[data-child='"+$child+"']");
        if(tempLineDown.find("img").attr("data-id")==$position){
          break;
        }else{
          tempLineDown.addClass($ranger);
          if(tempLineDown.find("img").attr("data-id")!=$position && tempLineDown.find("img").length==1){
            break;
          }
        }
      }
      //Line Top For Rook
      for(var i=rookLineTop.prevAll().length;i>=1;i--){
        var tempLine = $(".line[data-row='"+i+"'] .block[data-child='"+$child+"']");
        if(tempLine.find("img").attr("data-id")==$position){
          break;
        }else{
          tempLine.addClass($ranger);
          if(tempLine.find("img").attr("data-id")!=$position && tempLine.find("img").length==1){
            break;
          }
        }
      }
      // Line Left for Rook
      for(var k=1;k<=line.find(".block[data-child='"+$child+"']").nextAll().length;k++){
        var tempLineLeft = $(".line[data-row='"+$parent+"'] .block[data-child='"+parseInt(k+parseInt($child))+"']");
        if(tempLineLeft.find("img").attr("data-id")==$position){
          break;
        }else{
          tempLineLeft.addClass($ranger);
          if(tempLineLeft.find("img").attr("data-id")!=$position && tempLineLeft.find("img").length==1){
            break;
          }
        }
      }
      $breaksRight = false;
      //Line Right for Rook
      for(var k=$child-1;k>=1;k--){
        var tempLineRight = $(".line[data-row='"+$parent+"'] .block[data-child='"+k+"']");
        //console.log(k);
        if(tempLineRight.find("img").attr("data-id")==$position){
          break;
        }else{
          tempLineRight.addClass($ranger);
          if(tempLineRight.find("img").attr("data-id")!=$position && tempLineRight.find("img").length==1){
            break;
          }
        }
      }
  }
  //** End Rook **/
  //** Start Queen **/
  if($identity=="queen"){
    var linesOnTop  = line.prevAll().length;
    var linesOnBottom  = line.nextAll().length;
    $parent = parseInt($parent);
    // Line top Left
    $TopLeftchild = parseInt($child);
    for(i=linesOnTop;i>=1;i--){
        $TopLeftchild = $TopLeftchild + 1;
        var tempBishopLine = $(".line[data-row='"+i+"'] .block[data-child='"+$TopLeftchild+"']");
        if(tempBishopLine.find("img").attr("data-id")!=$position || tempBishopLine.find("img").length==0){
          tempBishopLine.addClass($ranger);
          if(tempBishopLine.find("img").attr("data-id")!=$position && tempBishopLine.find("img").length==1){
            break;
          }
        }else{
          break;
        }
    }
    //Line top Right
    $TopRightchild = parseInt($child);
    for(i=linesOnTop;i>=1;i--){
        $TopRightchild = $TopRightchild - 1;
        var tempBishopLine = $(".line[data-row='"+i+"'] .block[data-child='"+$TopRightchild+"']");
        if(tempBishopLine.find("img").attr("data-id")!=$position || tempBishopLine.find("img").length==0){
          tempBishopLine.addClass($ranger);
          if(tempBishopLine.find("img").attr("data-id")!=$position && tempBishopLine.find("img").length==1){
            break;
          }
        }else{
          break;
        }
    }
    // Bottom Left
    $BottomLeftchild = parseInt($child)-1;
    for(var x=$parent;x<=8;x++){
        $BottomLeftchild = $BottomLeftchild + 1;
        if(x!=$parent){
          var tempBishopLine = $(".line[data-row='"+x+"'] .block[data-child='"+$BottomLeftchild+"']");
          if(tempBishopLine.find("img").attr("data-id")!=$position || tempBishopLine.find("img").length==0){
            tempBishopLine.addClass($ranger);
            if(tempBishopLine.find("img").attr("data-id")!=$position && tempBishopLine.find("img").length==1){
              break;
            }
          }else{
            break;
          }
        }
    }
    // Bottom Right
    $BottomRightchild = parseInt($child)+1;
    for(i=$parent;i<=8;i++){
        $BottomRightchild = $BottomRightchild - 1;
        if(i!=$parent){
          var tempBishopLine =  $(".line[data-row='"+i+"'] .block[data-child='"+$BottomRightchild+"']");
          if(tempBishopLine.find("img").attr("data-id")!=$position || tempBishopLine.find("img").length==0){
            tempBishopLine.addClass($ranger);
            if(tempBishopLine.find("img").attr("data-id")!=$position && tempBishopLine.find("img").length==1){
              break;
            }
          }else{
            break;
          }
        }
    }
    // end bishop
    var rookLineTop   = line;
    //Line Down for rook
    for(var j=1;j<=rookLineTop.nextAll().length;j++){
      var tempLineDown = $(".line[data-row='"+ parseInt(parseInt($parent)+parseInt(j)) +"'] .block[data-child='"+$child+"']");
      if(tempLineDown.find("img").attr("data-id")==$position){
        break;
      }else{
        tempLineDown.addClass($ranger);
        if(tempLineDown.find("img").attr("data-id")!=$position && tempLineDown.find("img").length==1){
          break;
        }
      }
    }
    //Line Top For Rook
    for(var i=rookLineTop.prevAll().length;i>=1;i--){
      var tempLine = $(".line[data-row='"+i+"'] .block[data-child='"+$child+"']");
      if(tempLine.find("img").attr("data-id")==$position){
        break;
      }else{
        tempLine.addClass($ranger);
        if(tempLine.find("img").attr("data-id")!=$position && tempLine.find("img").length==1){
          break;
        }
      }
    }
    // Line Left for Rook
    for(var k=1;k<=line.find(".block[data-child='"+$child+"']").nextAll().length;k++){
      var tempLineLeft = $(".line[data-row='"+$parent+"'] .block[data-child='"+parseInt(k+parseInt($child))+"']");
      if(tempLineLeft.find("img").attr("data-id")==$position){
        break;
      }else{
        tempLineLeft.addClass($ranger);
        if(tempLineLeft.find("img").attr("data-id")!=$position && tempLineLeft.find("img").length==1){
          break;
        }
      }
    }
    $breaksRight = false;
    //Line Right for Rook
    for(var k=$child-1;k>=1;k--){
      var tempLineRight = $(".line[data-row='"+$parent+"'] .block[data-child='"+k+"']");
      console.log(k);
      if(tempLineRight.find("img").attr("data-id")==$position){
        break;
      }else{
        tempLineRight.addClass($ranger);
        if(tempLineRight.find("img").attr("data-id")!=$position && tempLineRight.find("img").length==1){
          break;
        }
      }
    }
    // end rook
    var kingLine = line;
      kingLine.setChild([parseInt($child)+1,$position,$ranger]);
      kingLine.setChild([parseInt($child)-1,$position,$ranger]);
      for(var i=0;i<=1;i++){
        if(i!=0){
          kingLine.prev().setChild([parseInt($child)+i,$position,$ranger]);
          kingLine.prev().setChild([parseInt($child)-i,$position,$ranger]);
          kingLine.next().setChild([parseInt($child)+i,$position,$ranger]);
          kingLine.next().setChild([parseInt($child)-i,$position,$ranger]);
        }else{
          kingLine.prev().setChild([parseInt($child),$position,$ranger]);
          kingLine.next().setChild([parseInt($child),$position,$ranger]);
        }
      }
      // end queen
  }
  //** End Queen **/
  // adding age to marker_

  if($marker==false){
    removeHighlight($id);
    $(".marker_"+$id+",.marker_"+$id+"_right,.marker_"+$id+"_left,.marker_"+$id+"_"+$direction).addClass("old_"+$id+"_marker");
  }
  $(".marker_"+$id+",.marker_"+$id+"_right,.marker_"+$id+"_left,.marker_"+$id+"_"+$direction).addClass("old_"+$id+"_marker");
}
// logging
$(".toggleLogs").click(function(){
  if($log==true){
    status("Logs are turned Off");
    $(this).html("On");
    $log = false;
  }else{
    status("Logs are turned On",true);
    $(this).html("Off");
    $log = true;
  }
});
//free Mode
$(".FreeMoveMode").click(function(){
  if($freeMoveMode){
    $freeMoveMode = false;
    $(this).html("Off");
  }else{
    $freeMoveMode = true;
    $(this).html("On");
  }
})
// block positioning
$(".block").click(function(){
  $parent   = $(this).attr("data-id");
  $child    = $(this).attr("data-child");
  $line     = $(this).parent().attr("data-row");
  $id       = $(this).find("img").attr("data-unique");
  if($(this).hasClass("range")){

    ProcessPlacing($oldChildPosition,$oldParentPosition,$child,$parent);
    //****/
    ProcessRange($parent,$child,$parent,$oldDirection,$oldColor,$oldIdentity,$oldPosition,false);
    //****/
    return false;
  }
  $(".block").removeClass("range selected ");
  if($(this).find("img").length==1){
    $color    = $(this).find("img").attr("data-color");
    $direction= $(this).find("img").attr("data-dir");
    $identity = $(this).find("img").attr("data-type");
    $position = $(this).find("img").attr("data-id");
    $oldColor     = $color;
    $oldDirection = $direction;
    $oldIdentity  = $identity;
    $oldPosition  = $position;

    $oldChildPosition = $child;
    $oldParentPosition= $parent;
    if($freeMoveMode==false){
      ProcessRange($parent,$child,$line,$direction,$color,$identity,$position);
    }else{
      $(".block").addClass("range");
      //$(".FreeMoveMode").click();
    }
    // logging
    status("For Parent <b>"+$parent+"</b> Child <b>"+$child+"</b><br> Having Identity <b>"+$identity+"</b> At Position <b>"+$position+"</b>\
     <br>At line <b>"+$line+"</b> Color "+$color+"<br> Marked Direction <b>"+$direction+"</b> Was Clicked");
   }else{
     // logging
     status("For Parent "+$parent+" Child "+$child+"<br>\
     At line "+$line+" Was Clicked");
   }
});
}(jQuery));
