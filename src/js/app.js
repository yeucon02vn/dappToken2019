App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 100000000,
    tokensSold: 0,
    tokensAvailable: 750000,
    test: '0x0',

    init: function() {
        console.log("App initialized...")
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
          } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/751ca2ab7c654cdf979c0e92e10c82f2');
            web3 = new Web3(App.web3Provider);
          }
          return App.initContracts();
    },

    initContracts: function() {
        $.getJSON("TeamTokenSale.json", teamTokenSale => {
            App.contracts.TeamTokenSale = TruffleContract(teamTokenSale);
            App.contracts.TeamTokenSale.setProvider(App.web3Provider);
            App.contracts.TeamTokenSale.deployed().then(teamTokenSale => {
                console.log("Team Token Sale Address:", teamTokenSale.address);

            });
        }).done(function() {
            $.getJSON("TeamToken.json", teamToken => {
                App.contracts.TeamToken = TruffleContract(teamToken);
                App.contracts.TeamToken.setProvider(App.web3Provider);
                App.contracts.TeamToken.deployed().then(teamToken => {
                    console.log("Team Token Address:", teamToken.address);
                });
                App.listenForEvents();
                return App.render();
            });
        })
    },

    listenForEvents: function() {
        App.contracts.TeamTokenSale.deployed().then(instance => {
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: 'lastest',
            }).watch(function(error, event) {
                App.render();
            })
        })
    },

    render: function() {
        
        if(App.loading)
            return;
        App.loading = true;

        var loader = $('#loader');
        var content = $('#content');

        loader.show();
        content.hide();

        web3.eth.getCoinbase(function(err,account) {
            if(err === null) {
                App.account = account;
                $('#accountAddress').html("Your Account: " + account);
            }
        })

        App.contracts.TeamTokenSale.deployed().then(function(instance) {
            TeamTokenSaleInstance = instance;
            return TeamTokenSaleInstance.tokenPrice();
          }).then(function(tokenPrice) {
            App.tokenPrice = App.tokenPrice;
            $('.token-price').html(web3.fromWei(tokenPrice, 'ether').toLocaleString('fullwide', {useGrouping:false}));
            return TeamTokenSaleInstance.tokensSold();
          }).then(function(tokensSold) {
            App.tokensSold = tokensSold;
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);
            
            var progressPrecent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
            $('#progress').css('width', progressPrecent + '%');
            
            App.contracts.TeamToken.deployed().then(function(instance) {
                TeamTokenInstance = instance;
                return TeamTokenInstance.balanceOf(App.account);
            }).then(function(balance) {
                $('.dapp-balance').html(balance.toLocaleString('fullwide', {useGrouping:false}));
                App.loading = false;
                loader.hide();
                content.show();
            })
        });
      
    },

    buyTokens: function() {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.TeamTokenSale.deployed().then(instance => {
        return instance.buyTokens(numberOfTokens, {
            from: App.account,
            value:  App.tokenPrice * numberOfTokens,
            gas: 500000
        });
        }).then(result => {
            console.log("Token bought...");
            $('form').trigger('reset');
            $('#loader').hide();
            $('#content').show();
        })
    },

    buyProducts: function() {
        $('#content').hide();
        $('#loader').show();
        var token = $('.article-price').text();
        console.log(token);
        App.contracts.TeamTokenSale.deployed().then(instance => {
            return instance.buyProducts(token, {
                from: App.account,
                gas: 500000
            });
        }).then(result => {
            console.log("Product bought...");
            $('form').trigger('reset');
            $('#loader').hide();
            $('#content').show();
        })
    }


}

$(function() {
    $(window).load(function() {
        App.init();
    })
});