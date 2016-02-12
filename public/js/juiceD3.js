var Data;
var d3Pie = function(data,heading){
	d3.selectAll('svg').remove();
	var pie = new d3pie("chart", {
		"header": {
			"title": {
				"text": heading,
			}
		},
		"size": {
			"canvasWidth": 650,
			"pieOuterRadius": "200px",
			"pieInnerRadius": "85%"
		},
		"data": {
			"content":data
		},
		"labels": {
			"outer": {
				"pieDistance": 25
			},
			"inner": {
				"hideWhenLessThanPercentage": 3
			}
		},
		"tooltips": {
	    	"enabled": true,
	    	"type": "placeholder",
	    	"string":"Quantity={value}"
	  }
	});
};
var barGraph = function(data){
	d3.selectAll("svg").remove()
	var max = d3.max(data,function(d){return d.value;});
	var min = d3.min(data,function(d){return d.value;});
	var svgContainer = d3.select(".chart").append("svg")
						.attr("width", 1300)
						.attr("height",600);
	var y = d3.scale.linear()
        .domain([0,max])
        .range([500,100]);
  var group = svgContainer.append("g")
  			.attr("id","barGraph")
  			.attr("class","graph");
	var formatPercent = d3.format("1.0%");
	var x = d3.scale.ordinal()
	    .rangeRoundBands([40, (data.length*40)+50], 0);

	var ya = d3.scale.linear()
			.domain([min,max+500])
	    .range([500, 80]);
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	var yAxis = d3.svg.axis()
	    .scale(ya)
	    .orient("right")
	group.append("g")
	      .attr("class", "graph")
	   	  .attr('id','axis')
	      .attr("transform", "translate(0," + 500 + ")")
	      .call(xAxis);

	  group.append("g")
	      .attr('id','axis')
	      .attr("class", "graph")
	      .call(yAxis)

    var text = group.selectAll(".text")
						.data(data)
						.enter().append("text")
						.attr('class','.text')
						.attr('id',function(d,i){
							return "text"+i;})
						.text(function(d){
							return d.label})
						.attr("x",function(d,i){
							return (i*30)+70;})
						.attr("y",function(d,i){
							return y(d.value);})
						.attr('stroke','black')
						.attr('stroke-width',1)
						.attr('transform',function(d,i){
							return 'rotate(-90 '+((i*30)+70)+' '+(y(d.value)-5)+')'
						})
    var line = group.selectAll(".bars")
    			.data(data)
    			.enter().append('line')
    			.attr('id',function(d,i){
							return "line"+i;})
    			.attr('x1',function(d,i){
							return (i*30)+70})
				.attr('y1',500)
				.attr('x2',function(d,i){
							return (i*30)+70;
				})
				.on('mouseover',function(d,i){
					d3.select(this)
					.attr('stroke','red')
					var id = this.id;
					var selector = id.replace('line','text')
					d3.selectAll("#"+selector)
					.text(function(d,i){
						return d.label+" ("+d.value+")"})
					.attr('stroke','red')
				})
				.on('mouseout',function(d,i){
					d3.select(this)
					.attr('stroke','black')
					var id = this.id;
					var selector = id.replace('line','text')
					d3.selectAll("#"+selector)
					.text(function(d,i){
						return d.label;})
					.attr('stroke','black')
				})
				.attr('y2',500)
				.transition().duration(1500).ease("linear")
				.attr('y2',function(d){
					return y(d.value);})
				.attr('stroke','black')
				.attr("stroke-width",20)
}
////===============================data============================\\\\
var sugarVsSugarLess = function(){
	$.get('juicedata',function(data){
		Data=JSON.parse(data)
		var sugar = 0;
		var sugarLess = 0;
		Data.forEach(function(each){
			if(each.isSugarless==true) sugarLess+=each.quantity
			else sugar+=each.quantity
		})
		var arrForPie=[{"label":"Sugar","value":sugar},{"label":"SugarLess","value":sugarLess}]
		if($('#sugarVsSugarLess')[0].innerHTML=="Suger VS SugerLess BAR CHART"){
			barGraph(arrForPie)
			$('#sugarVsSugarLess')[0].innerHTML="Suger VS SugerLess PIE CHART"
		}
		else
		if($('#sugarVsSugarLess')[0].innerHTML=="Suger VS SugerLess PIE CHART"){
			d3Pie(arrForPie,'Juices based on IsSugar')
			$('#sugarVsSugarLess')[0].innerHTML="Suger VS SugerLess BAR CHART"
		}
	});
};

var juiceConsumption = function(){
	$.get('juicedata',function(data){
		Data=JSON.parse(data);
		var count=[];
		Data.forEach(function(each){ count[each.drinkName]=(count[each.drinkName]||0)+each.quantity});
		var juiceNames = Object.keys(count);
		var arrForPie=[];
		for(var i in juiceNames){
			if(juiceNames[i]!='CTL' && juiceNames[i]!='ctl' && juiceNames[i]!='Register User'){
				arrForPie.push({'label':juiceNames[i],'value':count[Object.keys(count)[i]]})
			}
		}
		if($('#juiceConsumption')[0].innerHTML=="juices according consumption BAR CHART"){
			barGraph(arrForPie)
			$('#juiceConsumption')[0].innerHTML="juices according consumption PIE CHART"
		}
		else
		if($('#juiceConsumption')[0].innerHTML=="juices according consumption PIE CHART"){
			d3Pie(arrForPie,'Juices according consumption')
			$('#juiceConsumption')[0].innerHTML="juices according consumption BAR CHART"
		}
	})
};

var juiceAccordingDay = function(){
	$.get('juicedata',function(data){
		var count={};
		var days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY'];
		var countByDays=[];
		JSON.parse(data).forEach(function(each){
			var dateForm = new Date(each.date);
			count[days[dateForm.getDay()]]=(count[days[dateForm.getDay()]]||0)+each.quantity;
		});
		for(var day in count){
			countByDays.push({'label':day,'value':count[day]})
		}
		$("#pieForDay").click(d3Pie(countByDays,'JUICE CONSUMPTION ACCORDING TO DAY'));
	})
};
var juiceAccordingMonth = function(){
	$.get('juicedata',function(data){
		var count={};
		var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
		var countByMonth=[];
		JSON.parse(data).forEach(function(each){
			var dateForm = new Date(each.date);
			count[months[dateForm.getMonth()]]=(count[months[dateForm.getMonth()]]||0)+each.quantity;
		});
		for(var month in count)
			countByMonth.push({'label':month,'value':count[month]})

		d3Pie(countByMonth,"Juices According To Month")
	})
};
var juiceAccordingHours = function(){
	$.get('juicedata',function(data){
		var count=[];
		var arrForData=[];
		JSON.parse(data).forEach(function(each){
			var dateForm = new Date(each.date);
			count[dateForm.getHours().toString()]=(count[dateForm.getHours().toString()]||0)+each.quantity;
		});
		var hours = Object.keys(count);
		for(var time=0;time<24;time++){
			arrForData.push({'label':time+'-'+(+time+1),'value':count[time]})
		}
		d3Pie(arrForData,'Juices According Hours')
	})
};
