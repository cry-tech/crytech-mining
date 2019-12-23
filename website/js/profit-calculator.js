// Fill profitability comparision table
  function commaSepperate(input) {
    if (!input || !Number(input))
      return input;
    input = Math.round(input).toString();
    for (let i = input.length - 3; i > 0; i -= 3) {
      input = input.slice(0, i) + ',' + input.slice(i);
    }
    return input.replace('-,', '-');
  }

  function calculateProfit(item, investAmount, duration, bonus, weeklyReinvest, allowNegative) {
    item.hashRate = Number((investAmount / item.HashratePrice).toFixed(1));
    item.revenue = Math.round(item.hashRate * minePerTerahash * duration * btcPrice);
    item.costs = Math.round(item.MaintenanceCost * item.hashRate * duration);
    item.profit = (item.revenue - item.costs) * item.profitShare;
    item.assetsValue = Math.round(item.contractTime == 0 ? investAmount : investAmount - (investAmount / item.contractTime * 12));
    item.assetsValue = item.assetsValue * (1 + bonus);

    // ---------------------------
    if (weeklyReinvest) {
      var weeksInYear = duration / 7;
      item.revenue = item.costs = 0;
      var hashRate = item.hashRate;
      for (let j = 0; j < weeksInYear; j++) {
        var revenue = Math.round(hashRate * minePerTerahash * 7 * btcPrice);
        var costs = Math.round(item.MaintenanceCost * hashRate * 7);
        var profit = (revenue - costs) * item.profitShare;
        item.revenue += revenue;
        item.costs += costs;
        item.profit += profit;
        hashRate += profit / comparisionList[0].HashratePrice;
      }
    }
    // ---------------------------

    if (!allowNegative)
      item.profit = Math.max(0, item.profit);
    item.AssetPlustProfit = item.profit + item.assetsValue;
    item.profitPercentage = Math.round(item.AssetPlustProfit / investAmount * 100) - 100;
  }

  var minePerTerahash = 0.00001952; // Mining amount per Thash per day
  var btcPrice = 8900.63;
  var investAmount = 1000;
  var bonus = 20 / 100; // bonus percentage in ICO Phase

  var comparisionList = [{
    id: "crytech",
    name: "CryTech Mining",
    MaintenanceCost: 0.13, // Maintenance cost per Thash per Day
    HashratePrice: 40, // Price per THash
    contractTime: 0, // contract duration in months. 0 means unlimited
    profitShare: 0.5
  },
  {
    id: "crytechBonus",
    name: "CryTech Mining with bonus",
    MaintenanceCost: 0.13,
    HashratePrice: 33.33,
    contractTime: 0,
    profitShare: 0.5
  },
  {
    id: "crytechBonusCry",
    name: "CryTech mining with bonus. Payment in CRY token",
    MaintenanceCost: 0.13,
    HashratePrice: 33.33,
    contractTime: 0,
    profitShare: 0.5
  }, {
    id: "mining.bitcoin.com",
    name: "mining.bitcoin.com",
    MaintenanceCost: 0.1,
    HashratePrice: 25,
    contractTime: 12,
    profitShare: 1
  },
  {
    id: "genesisMining",
    name: "Genesis Mining",
    MaintenanceCost: 0.15,
    HashratePrice: 41.7,
    contractTime: 21,
    profitShare: 1
  },
  {
    id: "hashmart",
    name: "Hashmart",
    MaintenanceCost: 0.13,
    HashratePrice: 98,
    contractTime: 0,
    profitShare: 1
  }
  ];

  function fillComparisionTable() {
    for (let i = 0; i < comparisionList.length; i++) {
      var item = comparisionList[i];
      calculateProfit(
        item,
        investAmount,
        365,
        item.id == "crytechBonusCry" || item.id == "crytechBonus" ? bonus : 0,
        item.id == "crytechBonusCry",
        true
      );

      $("#trInvest > td")[i].innerText = "$" + commaSepperate(investAmount);
      $("#trHashrate > td")[i].innerText = item.hashRate + " Thash";
      $("#trRevenue > td")[i].innerText = "$" + item.revenue;
      $("#trCosts > td")[i].innerText = "$" + item.costs;
      $("#trProfit > td")[i].innerText = "$" + commaSepperate(item.profit);
      $("#trAssets > td")[i].innerText = "$" + commaSepperate(item.assetsValue);
      $("#trAssetPlusProfit > td")[i].innerText = "$" + commaSepperate(item.AssetPlustProfit);
      $("#trProfitPercentage > td")[i].innerText = item.profitPercentage + "%";
    }
  }

  fillComparisionTable();

  var afterICO = comparisionList[0];
  var IcoPhaseModel = comparisionList[1];
  var IcoPhaseCryModel = comparisionList[2];

  function updateProfitCalculator() {
    btcPrice = $("#rangeBtcPrice").val();
    var investValue = $("#calcInvestRange").val();
    var durationValue = $("#calcDurationRange").val();
    afterICO.hashRate = Math.round(investValue / afterICO.HashratePrice * 10) / 10;
    IcoPhaseCryModel.hashRate = IcoPhaseModel.hashRate =
      Math.round(investValue / IcoPhaseModel.HashratePrice * 10) / 10;
    calculateProfit(afterICO, investValue, durationValue * 30.4, 0, false);
    calculateProfit(IcoPhaseModel, investValue, durationValue * 30.4, 0.2, false);
    calculateProfit(IcoPhaseCryModel, investValue, durationValue * 30.4, 0.2, true);

    // putting results in UI
    $("#btcPriceValue").text("$" + commaSepperate(btcPrice));
    $("#calcInvestValue").text("$" + commaSepperate(investValue));
    $("#calcDurationValue").text(durationValue + " Month(s)");

    $("#hashRateAfterIco").text(afterICO.hashRate);
    $("#profitUsdAfterIco").text(commaSepperate(afterICO.profit));
    $("#AssetsPlusProfitAfterIco").text(commaSepperate(afterICO.AssetPlustProfit));
    $("#profitAfterIco").text(afterICO.profitPercentage + "%");

    $("#hashRateIco").text(IcoPhaseModel.hashRate);
    $("#profitUsdIco").text(commaSepperate(IcoPhaseModel.profit));
    $("#AssetsPlusProfitIco").text(commaSepperate(IcoPhaseModel.AssetPlustProfit));
    $("#profitIco").text(IcoPhaseModel.profitPercentage + "%");

    $("#hashRateIcoCry").text(IcoPhaseCryModel.hashRate);
    $("#profitUsdIcoCry").text(IcoPhaseCryModel.profit < 100000000 ?
      commaSepperate(IcoPhaseCryModel.profit) : "100,000,000+");
    $("#AssetsPlusProfitIcoCry").text(IcoPhaseCryModel.AssetPlustProfit < 100000000 ?
      commaSepperate(IcoPhaseCryModel.AssetPlustProfit) : "100,000,000+");
    $("#profitIcoCry").text(IcoPhaseCryModel.profitPercentage < 1000000 ?
      IcoPhaseCryModel.profitPercentage + "%" : "1000000%+");
  };

  $("#calcInvestRange, #calcDurationRange, #rangeBtcPrice").on("input", updateProfitCalculator);
  updateProfitCalculator();

  $.get("https://api.cryptonator.com/api/ticker/btc-usd", (data, status) => {
    if (data && data.ticker && data.ticker.price) {
      $("#rangeBtcPrice").val(Math.round(data.ticker.price * 1.01));
      updateProfitCalculator();
      fillComparisionTable();
    }
  });