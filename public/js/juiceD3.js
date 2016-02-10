var Data;
var sugarVsSugarLess = function(){
	$.get('juicedata',function(data){
		Data=JSON.parse(data)
		var sugar = Data.filter(function(each){
			return each.isSugarless==true;
		})
		var sugarLess = Data.filter(function(each){
			return each.isSugarless==false;
		})
		var arr = [{"name":"sugar","value":sugar.length},{"name":"sugarLess","value":sugarLess.length}]
		var arrForPie=[{"label":"Sugar","value":sugar.length},{"label":"SugarLess","value":sugarLess.length}]
		if($('#sugarVsSugarLess')[0].innerHTML=="Suger VS SugerLess BAR CHART"){
			barGraph(arr)
			$('#sugarVsSugarLess')[0].innerHTML="Suger VS SugerLess PIE CHART"
		}
		else
		if($('#sugarVsSugarLess')[0].innerHTML=="Suger VS SugerLess PIE CHART"){
			d3Pie(arrForPie,'Juices based on IsSugar')
			$('#sugarVsSugarLess')[0].innerHTML="Suger VS SugerLess BAR CHART"
		}	
	});
};

var barGraph = function(data){
	d3.selectAll("svg").remove()
	var svgContainer = d3.select(".chart").append("svg") 
						.attr("width", 1300)
						.attr("height",600);

	var y = d3.scale.linear()
        .domain([0,33000])
        .range([500,100]);
    var group = svgContainer.append("g")
    			.attr("id","barGraph")
    			.attr("class","graph");


	var formatPercent = d3.format("1.0%");
	var x = d3.scale.ordinal()
	    .rangeRoundBands([40, 300], 0);

	var ya = d3.scale.linear()
	    .range([500, 70]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(ya)
	    .orient("right")
	    .tickFormat(formatPercent);
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
							return "text"+i;
						})
						.text(function(d){
							return d.name
						})

						.attr("x",function(d,i){
							return (i*100)+80;
						})
						.attr("y",function(d,i){
							return y(d.value)-10;
						})
						.attr('stroke','black')
						.attr('stroke-width',1)

    var line = group.selectAll(".bars")
    			.data(data)
    			.enter().append('line')
    			.attr('id',function(d,i){
							return "line"+i;})
    			.attr('x1',function(d,i){
							return (i*100)+100})
				.attr('y1',500)
				.attr('x2',function(d,i){
							return (i*100)+100;
				})
				.on('mouseover',function(d,i){
					var id = this.id;
					var selector = id.replace('line','text')
					d3.selectAll("#"+selector)
					.text(function(d,i){
						return d.name+" ("+d.value+")"
					})
				})
				.on('mouseout',function(d,i){
					var id = this.id;
					var selector = id.replace('line','text')
					d3.selectAll("#"+selector)
					.text(function(d,i){
						return d.name
					})
					.attr('stroke','black')
				})
				.attr('y2',500)
				.transition().duration(1500).ease("linear")
				.attr('y2',function(d){
					return y(d.value);
				})
				.attr('stroke','black')
				.attr("stroke-width","40")
}

//======================================================================

var juiceConsumption = function(){
	$.get('juicedata',function(data){
		Data=JSON.parse(data);
		var count=[];
		Data.forEach(function(each){ count[each.drinkName]=(count[each.drinkName]||0)+1});
		var arr=[];
		var juiceNames = Object.keys(count);
		var arrForPie=[];
		for(var i in juiceNames){
			if(juiceNames[i]!='CTL' && juiceNames[i]!='ctl' && juiceNames[i]!='Register User'){
				arr.push({'name':juiceNames[i],'quantity':count[Object.keys(count)[i]]})
				arrForPie.push({'label':juiceNames[i],'value':count[Object.keys(count)[i]]})
			}
		}
		if($('#juiceConsumption')[0].innerHTML=="juices according consumption BAR CHART"){
			juiceconsumption(arr)
			$('#juiceConsumption')[0].innerHTML="juices according consumption PIE CHART"
		}
		else
		if($('#juiceConsumption')[0].innerHTML=="juices according consumption PIE CHART"){
			d3Pie(arrForPie,'Juices according consumption')
			$('#juiceConsumption')[0].innerHTML="juices according consumption BAR CHART"
		}	
	})
};

var juiceconsumption = function(data){
	d3.selectAll("svg").remove()
	var svgContainer = d3.select(".chart").append("svg") 
						.attr("width", 1300)
						.attr("height",600);

	var y = d3.scale.linear()
        .domain([7,30000])
        .range([500,10]);
	var group = svgContainer.append("g")
    			.attr("id","juiceconsumption")
    			.attr("class","graph");
    var paths = group.selectAll('defs').select('path')
    			.data(data)
    			.enter().append("defs").append("path")
				.attr("id",function(d,i){
					return 'path'+i
				})
				.attr("d",function(d,i){
					return ("M"+((i*30)+50)+','+(y(d.quantity)-10)+' '+((i*30)+50)+','+(y(d.quantity)-250))
				})
//========================================================				
	var formatPercent = d3.format("1.0%");
	var x = d3.scale.ordinal()
	    .rangeRoundBands([40, 1000], 10);

	var ya = d3.scale.linear()
	    .range([500, 170]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(ya)
	    .orient("right")
	    .tickFormat(formatPercent);
	svgContainer.append("g")
	    	.attr("class","graph")
	    	.attr('id','axis')
	      	.attr("transform", "translate(0," + 500 + ")")
	      	.call(xAxis);

	  svgContainer.append("g")
			.attr('id','axis')
	    	.attr("class", "graph")
	      	.call(yAxis)
//========================================================				
	var text = group.selectAll('text')
					.data(data)
					.enter().append('text')
					.append('textPath')
					.attr("xlink:href",function(d,i){
						return '#path'+i
					})
					.text(function(d){
						return d.name;
					})
					.attr('id',function(d,i){
						return 'text'+i
					})
					.attr('visibility','hidden')

	var line = group.selectAll(".bars")
    			.data(data)
    			.enter().append('line')
    			.attr('id',function(d,i){
							return "line"+i;})
    			.attr('x1',function(d,i){
							return (i*30)+50})
				.attr('y1',500)
				.attr('x2',function(d,i){
							return (i*30)+50;
				})
				.on('mouseover',function(d,i){
					var id = this.id;
					var selector = id.replace('line','text')
					d3.selectAll("#"+selector)
					.text(function(d,i){
						return d.name+" ("+d.quantity+")"
					})
					.attr('visibility','auto')
					d3.select(this)
					.attr('stroke',function(d,i){
						if(d.quantity>5000) return 'red';
						if(d.quantity>1000) return 'blue';
						return 'yellow';
					})
				})
				.on('mouseout',function(d,i){
					var id = this.id;
					var selector = id.replace('line','text')
					d3.selectAll("#"+selector)
					.attr('visibility','hidden')
					d3.select(this)
					.attr('stroke','black')
				})
				.attr('y2',500)
				.transition().duration(1000).ease('linear')
				.attr('y2',function(d,i){
					return y(d.quantity);
				})
				.attr('stroke','black')
				.attr("stroke-width","20")
}
//======================================================================
var juiceConsumptionAccDate = function(data){
	d3.selectAll("svg").remove()
	var svgContainer = d3.select(".chart").append("svg") 
						.attr("width", 1300)
						.attr("height",600);
}



var juiceAccordingDay = function(){
	$.get('juicedata',function(data){
		var count={};
		var days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY'];
		var countByDays=[];
		JSON.parse(data).forEach(function(each){ 
			var dateForm = new Date(each.date);
			count[days[dateForm.getDay()]]=(count[days[dateForm.getDay()]]||0)+1;
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
			count[months[dateForm.getMonth()]]=(count[months[dateForm.getMonth()]]||0)+1;
		});
		for(var month in count)
			countByMonth.push({'label':month,'value':count[month]})

		d3Pie(countByMonth,"Juices According To Month")
	})
};
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

var juiceAccordingHours = function(){
	$.get('juicedata',function(data){
		var count=[];
		var arrForData=[];
		JSON.parse(data).forEach(function(each){ 
			var dateForm = new Date(each.date);
			count[dateForm.getHours().toString()]=(count[dateForm.getHours().toString()]||0)+1;
		});
		var hours = Object.keys(count);
		for(var time=0;time<24;time++){
			arrForData.push({'label':time+'-'+(+time+1),'value':count[time]})
		}
		d3Pie(arrForData,'Juices According Hours')
	})
};


