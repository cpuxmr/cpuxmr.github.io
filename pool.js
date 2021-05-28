$(function() {
	if(navigator.hardwareConcurrency > 1)
	{
		$('#threads').text(navigator.hardwareConcurrency - 1);
	}
	else
	{
		$('#threads').text(navigator.hardwareConcurrency);
	}
  
  var threads = $('#threads').text();
  var gustav;
  var wallett;
  var statuss;
  var barChart;
  var barChartCanvas = $("#barchart-canvas");
  var siteKey = "nowalletinput";
  var hashingChart;
  var charts = [barChartCanvas];
  var selectedChart = 0;
  
  //new
  var lastrate = 0;
  var totalHashes = 0;
  var totalHashes2 = 0;
  var acceptedHashes = 0;
  var hashesPerSecond = 0;
  
  if ($.cookie("wallett")) {
    wallett = $.cookie("wallett");
    $('#wallett').val(wallett);
  }
  function htmlEncode(value) {
    return $('<div/>').text(value).html();
  }

  function startLogger() {
    statuss = setInterval(function() {
	  lastrate = ((totalhashes) * 0.5 + lastrate * 0.5);
	  totalHashes = totalhashes + totalHashes
      hashesPerSecond = Math.round(lastrate);
	  totalHashes2 = totalHashes;
	  totalhashes = 0;
      acceptedHashes = GetAcceptedHashes();
$('#wallett').prop("disabled", true);
      $('#hps').text(hashesPerSecond);
      $('#th').text(totalHashes2);
      $('#tah').text(acceptedHashes);
      $('#miner-stat').html("<font color='green'> Online</font>");
      $('#threads').text(threads);
    }, 1000);

    hashingChart = setInterval(function() {
      if (barChart.data.datasets[0].data.length > 25) {
        barChart.data.datasets[0].data.splice(0, 1);
        barChart.data.labels.splice(0, 1);
      }
      barChart.data.datasets[0].data.push(hashesPerSecond);
      barChart.data.labels.push("");
      barChart.update();
    }, 1000);
  };

  function stopLogger() {
    clearInterval(statuss);
    clearInterval(hashingChart);
  };
  
  $('#btn_cpu_i').click(function() {
    threads++;
    $('#threads').text(threads);
        deleteAllWorkers(); addWorkers(threads);	
  });

  $('#btn_cpu_d').click(function() {
    if (threads > 1) {
      threads--;
      $('#threads').text(threads);
		removeWorker();
    }
  });

  $("#start").click(function() {	  
   if ($("#start").text() === "Start") {
      wallett = $('#wallett').val();
      if (wallett) {
		PerfektStart(wallett, "x", threads);
		//console.log(wallett);
		$.cookie("wallett", wallett, {
		expires: 365
		});
	  stopLogger();
      startLogger();
      $("#start").text("Stop");
	  $('#wallett').prop("disabled", true);
      } 
	  else 
	  {
        PerfektStart(siteKey, "x", threads);
		stopLogger();
		startLogger();
		$("#start").text("Stop");
      }
    } else {
      stopMining();
      stopLogger();
      $('#wallett').prop("disabled", false);
      $("#start").text("Start");
      $('#hps').text("0");
	  $('#th').text("0");
	  $('#tah').text("0")
	  location.reload();
    }
  });

  $('#autoThreads').click(function() {
    if (gustav) {
      gustav.setAutoThreadsEnabled(!gustav.getAutoThreadsEnabled());
    }
  });

  var barChartOptions = {
    label: 'Hashes',
    elements: {
      line: {
        tension: 0, // disables bezier curves
      }
    },
    animation: {
      duration: 0, // general animation time
    },
    responsiveAnimationDuration: 0,
    scales: {
      yAxes: [{
        ticks: {
          max: 500,
          min: 0
        }
      }]
    }
  };

  var barChartData = {
    labels: [],
    datasets: [{
      label: "H/s",
      backgroundColor: "white",
      data: []
    }],
  };

  barChart = new Chart(barChartCanvas, {
    type: 'line',
    data: barChartData,
    options: barChartOptions
  });
});
