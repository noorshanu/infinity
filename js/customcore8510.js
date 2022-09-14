    //===============================================================
    
                
                        // GLOBAL DATA
    
    
    //==============================================================
    var oldMainContractAddress = '0x5fae379c3999681aD9A759C0ca5b7A02b8199BfC'; //done f
    var mainContractAddress = '0x32cb64d0A8d796Df478653690C3261F79c0fB813'; //done f
    var tokenContractAddress = '0x4a082943895b102C4afb7A7A8497248D0f8c705b'; //done f
    var routerContractAddress ='0x10ED43C718714eb63d5aA57B78B54704E256024E'; //done f
    var liquidityContractAddress = '0x751f6551C3EC952cDc20AAeA9C772fEA48342e79'; //done f
    var factoryContractAddress = ''; // if it is needed
    var instance;
    var _account;
    var referrer;
    var _PERCENTS_DIVIDER;
    var defaultReferrerAddress;
    var siteStatsObj;
    var userStatsAndTokensBalanceData;
    var userStatsObj;
    var reserves;
    var c = {DEFAULT_BNX_PRICE: 0.01};
    
    
    
    
    
    
    const notify = new Notyf({
        duration: 5000,
        position: {
            x: 'center',
            y: 'top',
        },
        types: [
            {
      type: 'warning',
      background: 'orange',
      duration: 0,
      icon: {
        className: 'material-icons',
        tagName: 'i',
        text: 'warning'
      }
    },
            {
                type: 'error',
                background: 'red',
                duration: 5000,
                dismissible: true
            }
        ]
    });

    
    
    
    

                /****************** UPDATE DATA LOOPS ************************/
function updateSiteStats(period=400 /*miliseconds*/){
        let _this = this;
        
        

        setTimeout(async function tick() {
            try {
                let _siteStatsObj = await _this.getSiteStats();
                let _reserves = await _this.getReserves();
                reserves = _reserves;
                siteStatsObj = _siteStatsObj;
              
            
                let bnfPrice = getBNXPrice().toFixed(4);
                let bnfPriceChange = getBNXPriceChange();
                $('.bnfPrice').text(bnfPrice + "USD");
                $('.bnfPriceChange').text(bnfPriceChange + "%");
                console.log(bnfPrice + " " + "usd");
            
               
            
                let totalInvested = await getTotalInvested();
                $('.getTotalInvested').text(Number(totalInvested).toFixed(2));
                let totalDeposits = await getTotalDeposits();
                $('.getTotalDeposits').text(totalDeposits);
                
                let lpTokenLink = 'https://bscscan.com/address/'+ liquidityContractAddress;
                let aText = liquidityContractAddress.substring(0,6) + '...' + liquidityContractAddress.slice(-7);
                
                $('#pairAddress').attr('href', lpTokenLink);
                $('.pairAddress').text(aText);
                $('.tokenAddressToCopy').text(tokenContractAddress.substring(0,6) + '...' + tokenContractAddress.slice(-7));
                // $('.stdText').text(_account.substring(0,2) + '...' + _account.slice(-3));
                
                
                // let checkMobile = isFromMobile();
                // if(checkMobile){
                    
                // }
                
                
                
                
                
                
                
                
                
                
                
                
                
            
    
                setTimeout(tick, period);
            } catch (ex) {
                console.log(ex);
                setTimeout(tick, period);
            }
        }, 200);
        
    }
function updateUserStatsAndTokensBalance(currentAddress, period=400 /*miliseconds*/){
        let _this = this;

        setTimeout(async function tick() {
            try {
                const LPBalance = await _this.getLPTokensBalance(currentAddress);
                const BNXBalance = await _this.getBNXTokensBalance(currentAddress);
                const stakeData = await _this.getUserStakeStats(currentAddress);
                const _userStatsObj = await _this.getUserStats(currentAddress);
              
                const BNBBalance = await web3.eth.getBalance(currentAddress);
                const user = await _this.getUser(currentAddress);
                const userReferralStatsObj = await _this.getUserReferralsStats(currentAddress);
                const oldReferralStatsObj = await _this.getOldUserReferralsStats(currentAddress);
                const oldUserStats = await _this.getOldUserStats(currentAddress);
                console.log(oldUserStats);
               let result = {
                   LPBalance,
                   BNXBalance,
                   BNBBalance: web3.utils.fromWei(BNBBalance, "ether"),
                   stakeAmount: stakeData.amount,
                   accumulatedReward: stakeData.accumulatedReward,
                   stakeWithdrawnAmountBNX: stakeData.withdrawnReward,
                   userStakeHoldPerc:  stakeData.userStakeHoldPerc,
                   VipStakePerc: stakeData.vipStakePerc,
                   userStakePerc: stakeData.userStakePerc
               }
                userStatsAndTokensBalanceData = result;
                userStatsObj = _userStatsObj
                
                let bnfTokenBal = withoutRound(getUserBNXBalance());
                $('.bnfTokenBalance').text(bnfTokenBal);
                
                let dailyYield = getDailyRewardFromStaking().toFixed(2);
                $('.dailyYield').text("+" + dailyYield + " " +"BNF");
                
                let userHoldBonus = getUserHoldBonus().toFixed(2);
                let userVIPBonus = getUserVipBonus().toFixed(2);
                $('.holdBonus').text('+' + userHoldBonus + '%');
                $('.vipBonus').text('+' + userVIPBonus + '%');
                
                
                let bnflpTokenBal = getUserLPBalance();
                $('.bnflpTokenBalance').text(withoutRound(bnflpTokenBal)+" ");
                
                
                let getAvailableBNF = getAvailableBNX();
                $('.getAvailableBNF').text(withoutRound(getAvailableBNF));
                
                
                
                let totalLiquidity = getTotalLiquidity();
                
                let lpInUsd = getLpToUsd();
                $('.lpInUsd').text("≈ $"+lpInUsd.toFixed(2));
                
                let unstakedStakedAmount = getUnstakedStakedAmount();
                $('.unstakedStakedAmount').text(withoutRound(unstakedStakedAmount)+" ");
                $('#unstakedStakedAmount').text(withoutRound(unstakedStakedAmount)+" ");
                
                let stakedAmount = getStakedAmount();
                $('.stakedAmount').text(withoutRound(stakedAmount)+" ");
                $('#stakedAmount').text(withoutRound(stakedAmount)+" ");
                
                let totalLiquidityUsd = getTotalLiquidityUsd().toFixed(2);
                $('.totalLiquidityUsd').text(totalLiquidityUsd);
                
                let userLPBalanceStakingPage = getUserLPBalanceStakingPage();
                $('.userLPBalanceStakingPage').text(withoutRound(userLPBalanceStakingPage))+" ";
                
                let userBnbBalance = await web3.eth.getBalance(_account);
                userBnbBalance = web3.utils.fromWei(userBnbBalance);
                $('.userBnbBalance').text(withoutRound(userBnbBalance));
                
                
                $('.totalDeposits').text(userStatsObj["userDepsTotal"]);
                if(userStatsObj["userDeposits"] != 0){
                    $('#referralLink').val("https://bnbfarm.io?ref="+_account);
                }
                
                $('.userAmountOfDeposits').text(userStatsObj["userDeposits"]);
                let totalEarned = Number(userStatsObj["userAvailab"])+Number(userStatsObj["userWithdrawn"]);
                $('.totalEarned').text(totalEarned.toFixed(4));
                
                $('.totalWithdrawn').text(Number(userStatsObj["userWithdrawn"]).toFixed(4));
                $('.userAvailableToWithdraw').text(Number(userStatsObj["userAvailab"]).toFixed(4));
                
                
                $('.referralEarnings').text(" "+ web3.utils.fromWei(String(userReferralStatsObj["userBonus"])));
                $('.oldUserStats').text(" " + Number(oldUserStats).toFixed(4));
                // $('.oldReferralEarnings').text(" "+ web3.utils.fromWei(String(oldReferralStatsObj["userBonus"])));
                
                $('.referralLevel').text(" "+userReferralStatsObj["userRefLevel"]);
                
                
                let userUpline = await getUser(_account);
                $('#upline').text(userUpline.referrer);
                if(userUpline.referrer === "0x0000000000000000000000000000000000000000"){
                    if(localStorage.getItem("referrer") == "null"){
                        console.log("this is nill");
                        $('#upline').text("No Upline");
                    }
                    else{
                        console.log(localStorage.getItem("referrer"));
                        $('#upline').text(localStorage.getItem("referrer"));
                    }
                }
                else{
                    $('#upline').text(userUpline.referrer);
                }
                
                console.log(userUpline.referrer);
                console.log(typeof(userUpline.referrer));
                
                
                
                let dailyYieldFromDeposit = getDailyRewardFromDeposit().toFixed(2);
                $('.dailyYieldFromDeposit').text("+" + dailyYieldFromDeposit + " " +"BNB");
                
                let depositHoldBonus = getDepositUserHoldBonus().toFixed(2);
                let depositVIPBonus = getDepositUserVipBonus().toFixed(2);
                
                $('.depositHoldBonus').text('+' + depositHoldBonus + '%');
                $('.depositVIPBonus').text('+' + depositVIPBonus + '%');
                
                
                
                
                
                
                let getUserBadgeData = await getUserBadgeStats();
                if(getUserBadgeData[1] == ""){
                    $('.rankName').text("Ambassador");
                    $('#badgeImgTag').attr('src','img/blueBadge.png');
                }
                else{
                    if(getUserBadgeData[1] == "Manager"){
                       $('.rankName').text(getUserBadgeData[1]);
                       $('#badgeImgTag').attr('src','img/redBadge.png');
                    }
                    else{
                        if(getUserBadgeData[1] == "Executive"){
                            $('.rankName').text(getUserBadgeData[1]);
                            $('#badgeImgTag').attr('src','img/greenBadge.png');
                        }
                        else{
                            if(getUserBadgeData[1] == "Director"){
                                $('.rankName').text(getUserBadgeData[1]);
                                $('#badgeImgTag').attr('src','img/yellowBadge.png');
                            }
                        }
                    }
                    
                }
                
                
                
                if($('#bnfInput').val() == 0 || $('#bnbInput').val() == 0){
                    $('.possiblePoolShare').text('0.00');
                }
                
                
                let userDirect = await getUserDirect(_account);
                $('.userDirect').text(userDirect);
                
                let contractBalance = await getContractBalance();
                contractBalance = web3.utils.fromWei(contractBalance);
                contractBalance = Number(contractBalance);
                $('.contractBalance').text(contractBalance.toFixed(2));
                
                await setUserRefsNumber(_account);
                await isActive(_account);
                
                
                
                
    
                
                
              

            setTimeout(tick, period);
            } catch (ex) {
                console.log(ex)
            setTimeout(tick, period);
            }
        }, 200);
    }

function getCurrentRate(period = 60000 /* miliseconds */) {
        let _this = this;
        setTimeout(async function tick() {
          let currentRate;
          const now = new Date;
          const requestTimestampUtc = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
                now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
          try {
            if(localStorage.getItem('rate') && localStorage.getItem('rateTimeStamp')){
              if(localStorage.getItem('rateTimeStamp') && (requestTimestampUtc <= (+localStorage.getItem('rateTimeStamp') + 300000))){
                
                
              }else if(localStorage.getItem('rateTimeStamp') && (requestTimestampUtc > (+localStorage.getItem('rateTimeStamp') + 300000))){
                currentRate = await _this.getLatestTrxToUsdRate();
                localStorage.setItem("rate", currentRate);
                localStorage.setItem("rateTimeStamp", requestTimestampUtc);
                
                
              }
            }else {
                currentRate = await _this.getLatestTrxToUsdRate();
                localStorage.setItem("rate", currentRate);
                localStorage.setItem("rateTimeStamp", requestTimestampUtc);
                
              }
            setTimeout(tick, period);
          } catch (ex) {
              console.log(ex);
            setTimeout(tick, period);
          }
        }, 300);
      }


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    


async function init(){
        if (window.localStorage.getItem("selectedWallet") === "metamask" && window.ethereum) {
            if(window.ethereum.chainId == 56 || window.ethereum.chainId == "0x38"){
                window.web3 = new Web3(ethereum);
                await ethereum.enable();
                let obj = makeObject();
                return obj;
            }else{
                alert("Change network to Binance Smart Chain Mainnet");
            }
            
        }
        else{
            if (window.localStorage.getItem("selectedWallet") === "binance" ) {
                if(window.BinanceChain.chainId === "0x38" || window.BinanceChain.chainId == 56){
                    window.web3 = new Web3(window.BinanceChain);
                    await BinanceChain.enable();
                    let obj = makeBnbChainObj();
                    return obj;
                }else{
                    alert("Change network to Binance Smart Chain Mainnet");
                }
                
        }
        else{
                //.....custom rpc
                alert("Install Metamask, Binance Chain or Trust Wallet");
            }
    }
}

if(localStorage.getItem("selectedWallet") === "metamask"){
    var ethereumAccountChange = setInterval(function() {
    window.ethereum.on('accountsChanged', function (accounts) {
        localStorage.setItem("address", accounts[0]);
        changeConnectBtn(accounts[0]);
        location.reload();
        });
    }, 700);
}
else{
    if(localStorage.getItem("selectedWallet") === "binance"){
        var binanceAccountChange = setInterval(function() {
        window.BinanceChain.on('accountsChanged', function (accounts) {
        localStorage.setItem("address", accounts[0]);
        changeConnectBtn(accounts[0]);
        location.reload();
            });
        }, 700);
    }
}





async function makeObject() {
    let obj = {
                oldMainContract: 0,
                metaMaskAddress: 0,
                mainContract: 0,
                tokenContract: 0,
                routerContract: 0,
                liquidityContract: 0
            }
            try{
                
                let metaMaskAddress = await web3.eth.getAccounts();
                metaMaskAddress = metaMaskAddress[0];
                const oldMainContract = new web3.eth.Contract(oldContractAbi, oldMainContractAddress);
                const mainContract = new web3.eth.Contract(contractAbi, mainContractAddress);
                const tokenContract = new web3.eth.Contract(tokenContractAbi, tokenContractAddress);
                const routerContract = new web3.eth.Contract(routerContractAbi, routerContractAddress);
                const liquidityContract = new web3.eth.Contract(liquidityContractAbi, liquidityContractAddress);
                
                obj.oldMainContract = oldMainContract;
                obj.metaMaskAddress = metaMaskAddress;
                obj.mainContract = mainContract;
                obj.tokenContract = tokenContract;
                obj.routerContract = routerContract;
                obj.liquidityContract = liquidityContract;
                return obj;

            }
            catch(error){
                console.log(error);
            }
            return obj;
}

async function makeBnbChainObj(){
    let obj = {
                                oldMainContract: 0,
                                bnbWalletAddress: 0,
                                mainContract: 0,
                                tokenContract: 0,
                                routerContract: 0,
                                liquidityContract: 0
                            }
                            try{
                    
                    
                                let bnbWalletAddress = await web3.eth.getAccounts();
                                bnbWalletAddress = bnbWalletAddress[0];
                                
                                const oldMainContract = new web3.eth.Contract(oldContractAbi, oldMainContractAddress);
                                const mainContract = new web3.eth.Contract(contractAbi, mainContractAddress);
                                const tokenContract = new web3.eth.Contract(tokenContractAbi, tokenContractAddress);
                                const routerContract = new web3.eth.Contract(routerContractAbi, routerContractAddress);
                                const liquidityContract = new web3.eth.Contract(liquidityContractAbi, liquidityContractAddress);
                                
                                obj.oldMainContract = oldMainContract;
                                obj.bnbWalletAddress = bnbWalletAddress;
                                obj.mainContract = mainContract;
                                obj.tokenContract = tokenContract;
                                obj.routerContract = routerContract;
                                obj.liquidityContract = liquidityContract;
                                return obj;
                            }
                            catch(error){
                                console.log(error);
                            }
                            return obj;
}


async function changeConnectBtn(address) {

    if (address === undefined) {
        $('.connect').html("<span class='icon icon-connect'></span><span>Join</span>");
        $('.connect').attr('disabled', false);  
        localStorage.removeItem("selectedWallet");
        localStorage.removeItem("address");
    }
    else{
        $('.connect').html("<span class='stdText'>" + address + "</span>");
        $('.deskConnect').html("<span class='stdText'>" + address.substring(0,3) + '...' + address.slice(-3) + "</span>");
        $('.deskConnect').css('min-width', '0px');  
        $('.connect').attr('disabled', true);  
        localStorage.setItem("address", address);
    }
}




$(document).ready(async function(){




    virtualReload();



 




async function virtualReload(){
setTimeout(async function(){
    
        if (localStorage.getItem("address") === undefined || localStorage.getItem("address") === null) {
        changeConnectBtn(undefined);
        console.log("No account connected");
    }
    else{
        changeConnectBtn(localStorage.getItem("address"));
        if(localStorage.getItem("selectedWallet") === "binance"){
                instance = await init();
                notify.success("Ready");
 
        }
        else{
            if(localStorage.getItem("selectedWallet") === "metamask"){
                instance = await init();
            }
            
        }
        
    }
    
    
    
    
        
        defaultReferrerAddress = await instance.mainContract.methods.DEFAULT_REFERRER_ADDRESS.call().call();
        _PERCENTS_DIVIDER = await instance.mainContract.methods.PERCENTS_DIVIDER.call().call();
        _MULTIPLIER = await instance.mainContract.methods.MULTIPLIER.call().call();
        getCurrentRate();
        updateUserStatsAndTokensBalance(_account);
        updateSiteStats();


},1000);
}

    
    //-------------------------------menu--------
    
    $('.open').click(function(){
            $(this).removeClass('active');
            $('.close').addClass('active');
            $('.menu-control').show();
    });
    $('.close').click(function(){
        
            $(this).removeClass('active');
            $('.open').addClass('active');
            $('.menu-control').hide();
        
    });
    //------------------------------------
    
    
    
    //---------------------------------------
    
    
    $('.remove-liq').click(function(){
        
        $(this).addClass("active");
        $('.add-liq').removeClass('active');
        $('.add-liq-tab').hide();
        $('.remove-liq-tab').show();
        
    });
    
    
    $('.add-liq').click(function(){
        
        $(this).addClass("active");
        $('.remove-liq').removeClass('active');
        $('.add-liq-tab').show();
        $('.remove-liq-tab').hide();
        
        
    });
    
    
    
    
    
    
    //---------------------------------------
    
    
    
    
    //-----------------------------stake-- unstake--------
    
    
    $('.stake-btn').click(function(){
        
        $(this).addClass("active");
        $('.unstake-btn').removeClass('active');
        $('.unstake').hide();
        $('.stake').show();
        
        //-----------------stake------------------
        
        
    });
    
    
    $('.unstake-btn').click(function(){
        
        $(this).addClass("active");
        $('.stake-btn').removeClass('active');
        $('.stake').hide();
        $('.unstake').show();
        
        //-------------------unstake-------------------------
        
        
    });
    
    
    //------------------------------------------------
    
    
    
    
    


    
    _account = localStorage.getItem('address');
    referrer = localStorage.getItem('referrer');


    $('.modal-container').hide();


    $('.connect').click(function(){

        walletConnectPopup();


    });

    $('.modal-close').click(function(){

       $('.modal-container').hide();

    });

    $(document).on('click','#metamaskWallet',function(e) {
        //handler code here
        $('.modal-container').hide();
        MetamaskWalletConnect();

    });


    $(document).on('click','#bnbWallet',function(e) {
        //handler code here
        $('.modal-container').hide();
        BnbWalletConnect();
    });


    $(document).on('click','.btn-makeDeposit',function(e){  
        makeADeposit();
    });
    
    
   
    
                
    

    let x = calculateInputValues();
    console.log(x);
    
    
    $('#addLiquidityBtn').click(async function(){
        if(isLogged){
            let bnbAmount = $('#bnbInput').val();
            let bnxAmount = $('#bnfInput').val();
            let bnbBalance = parseFloat($('.userBnbBalance').text());
            let bnfBalance = parseFloat($('.bnfTokenBalance').text());
            
            if(bnbBalance + 0.01 >= parseFloat(bnbAmount) && bnfBalance > parseFloat(bnxAmount)){
                notify.open({ type: 'warning', message: 'Hold on! <br> Adding Liquidity, please allow transaction when prompted' });
                $('#blockPageOverlay').show();
                try{
                    let hash = await addLiquidityETH(bnbAmount, bnxAmount, _account);
                    notify.dismissAll();
                    $('#blockPageOverlay').hide();
                    notify.success('Congrats! Liquidity Added <br><a target="_blank" href="https://bscscan.com/tx/'+hash.transactionHash+'"><u>View transaction on bscscan</u></a>');
                    
                    reloadOnBinance();
                        // waiting();
                }catch(error){
                    notify.dismissAll();
                    $('#blockPageOverlay').hide();
                    notify.error("Oops! Something went wrong");
                    reloadOnBinance();
                }
            }
            else{
                notify.error("Re-check your balance and input");
            }
            
            
        }
        else{
            walletConnectPopup();
        }
    });
   
    
    $('#removeLiquidityBtn').click(async function(){
        
        if(isLogged){
            let lpAmount = $('#removeLiquidityInput').val();
            let lpTokenBalance = parseFloat($('.bnflpTokenBalance').text());
            let bnbBalance = parseFloat($('.userBnbBalance').text());
            
            
            if(lpTokenBalance > parseFloat(lpAmount) && bnbBalance >= 0.01){
                notify.open({type:'warning',message: 'Hold on! <br> Removing Liquidity, please allow the transaction when prompted'});
                $('#blockPageOverlay').show();
                try{
                    let hash = await removeLiquidityETH(lpAmount, _account); 
                    notify.dismissAll();
                    $('#blockPageOverlay').hide();
                    notify.success('Liquidity Removed <br><a target="_blank" href="https://bscscan.com/tx/'+hash.transactionHash+'"><u>View transaction on bscscan</u></a>');
                    reloadOnBinance();
                }catch(error){
                    notify.dismissAll();
                    $('#blockPageOverlay').hide();
                    notify.error("Oops! Something went wrong");
                    reloadOnBinance();
                    
                }
            }
            else{
                notify.error("Re-check your balance and input");
            }
        
            
        }
        else{
            walletConnectPopup();
        }
        
        
    });        

    
    
    


});



//=====================================================================================


                            // Popup BLOCK 


//======================================================================================



function makeADeposit(){
    if(isLogged()){
        $('#depositPopup').show();
    }
    else{
        walletConnectPopup();
    }
}


function walletConnectPopup(){

    var tmpHtml= '<div class="select-wallet-wrapper flex-column"><button class="btn-option flex-row card" id="metamaskWallet"><span>Metamask</span><span class="icon metamask"></span></button><button class="btn-option flex-row card trustWallet identifierTrustWallet" id="metamaskWallet"><span>Trust Wallet</span><span class="icon identifierTrustWalletLogo"></span></button><button id="bnbWallet" class="btn-option flex-row card "><span>Binance Chain</span><span class="icon binance"></span></button></div><a class="question-wrapper"><span class="icon icon-question"></span><span>How to connect your wallet</span></a>';
    
        $('.modal-container').show();
        $('.modal-header span').text('Connect Using');
        $('.modal-content').html(tmpHtml);
        if(isFromMobile()){
            console.log(isFromMobile());
            $('.identifierTrustWallet').removeClass('trustWallet');
        }
        else{
            $('.identifierTrustWallet').addClass('trustWallet');
        }
}




function transactionPopup(message, transactionHash){
    
        let tmpHtml= '<div class="select-wallet-wrapper flex-column">' + message + '<a target="_blank" href="https://bscscan.com/tx/' + transactionHash + '">View transaction on bscscan</a></div>';
        
    
        $('.modal-container').show();
        $('.modal-header span').text("Transaction Confirmed");
        $('.modal-content').html(tmpHtml);
        
         console.log('ready');
    
    
}

function notifyPopup(message){
    
        let tmpHtml= '<div class="select-wallet-wrapper flex-column">' + message + '</div>';
    
        $('.modal-container').show();
        $('.modal-header span').text("Please Wait");
        $('.modal-content').html(tmpHtml);
        
         console.log('ready');
    
    
}




//==================================================================================


                            // walletConnect Block


//==================================================================================





async function MetamaskWalletConnect(){
    window.localStorage.setItem("selectedWallet", "metamask");
    instance = await init();
    changeConnectBtn(instance.metaMaskAddress);
    location.reload();

}

async function BnbWalletConnect(){
    window.localStorage.setItem("selectedWallet", "binance");
    instance = await init();
    changeConnectBtn(instance.bnbWalletAddress);
    location.reload();
}

/*********************************************************************/
                //Initialising contract objects


/*********************************************************************/





















//====================================================================


                // Main Contract (BNBFarm)



//===================================================================






    
   
    
    
    
    // tem call section is here 
    
    
    $(document).on('click','.deposit-btn',async function(e){
        let investAmount = $('#currencyInput').val();
        let bnbBalance = await web3.eth.getBalance(_account);
        bnbBalance = web3.utils.fromWei(bnbBalance);
        
        if(parseFloat(bnbBalance) +0.01 > parseFloat(investAmount)){
            try{
                notify.open({type:'warning',message: 'Hold on! <br> Depositing, please allow the transaction when prompted'});
                $('#blockPageOverlay').show();
                let hash = await invest(investAmount, referrer);
                notify.dismissAll();
                $('#blockPageOverlay').hide();
                notify.success('Successfully Deposited! <br><a target="_blank" href="https://bscscan.com/tx/'+hash.transactionHash+'"><u>View transaction on bscscan</u></a>');
                reloadOnBinance();
                    
            }catch(error){
                notify.dismissAll();
                $('#blockPageOverlay').hide();
                console.log(error);
                notify.error("Oops! Something went wrong");
                reloadOnBinance();
            }
        }
        else{
            notify.error("Re-check your balance and input");
        }
        
    });
    

    
    
    
//_________________________________________________________________________


                // read Section

//_________________________________________________________________________

   

//done for testing
async function getUserStakeStats(userAddress) {
    let rawData = await instance.mainContract.methods.getUserStakeStats(_account, liquidityContractAddress).call();
        // let VipStakePercRaw = await this.getUserStakeDepositRate(userAddress, this.liquidityContractAddress);

    let retrieved = {
            amount: web3.utils.fromWei(rawData[0]),
            accumulatedReward: web3.utils.fromWei(rawData[1]),
            withdrawnReward: web3.utils.fromWei(rawData[2]),
            vipStakePerc: parseInt(rawData[3]) / _PERCENTS_DIVIDER * 100,
            userStakeHoldPerc: parseInt(rawData[4]) / _PERCENTS_DIVIDER * 100,
            userStakePerc: parseInt(rawData[3]) + parseInt(rawData[4])
            
    }

    return retrieved;
}

//     //done for testing
// async function getContractBalance() {
//     let rawResult = await instance.mainContract.methods.getContractBalance().call({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
// }

// //done for testing
// async function getContractBalanceRate() {
//     let rawResult = await instance.mainContract.methods.getContractBalanceRate().call({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
// }

 
 
    
   
/********************************************** WRITE METHODS **************************************************************/
    //1 done for testing
    async function invest(value, ref="") {
        if(!ref || ref == "null") {
            ref = defaultReferrerAddress;
        }
        value = web3.utils.toWei(value,'ether');
        let balanceBN = await web3.eth.getBalance(_account);
        const balance = balanceBN.toString();
        
        let rawTransaction = await instance.mainContract.methods.invest(ref).send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account, value: value});
        // rawTreansaction - meaning that we are waiting for transaction to be mined inside the components
        let data = await rawTransaction;
        return rawTransaction;;
    }

    //2 done for testing
    async function withdrawFromOldContract() {
        
        notify.open({ type: 'warning', message: 'Hold on! <br> Withdrawing your reward, please allow transaction when prompted' });
        $('#blockPageOverlay').show();
        try{
            
            let result =  await instance.oldMainContract.methods.withdraw().send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
            
            
            
            
            let hash = result;
            notify.dismissAll();
            $('#blockPageOverlay').hide();
            notify.success('Congrats! Successfully Withdrawn <br><a target="_blank" href="https://bscscan.com/tx/'+hash.transactionHash+'"><u>View transaction on bscscan</u></a>');
            reloadOnBinance();
                    
        }
        catch(error){
            notify.dismissAll();
            $('#blockPageOverlay').hide();
            notify.error('Oops! Something went wrong');
            reloadOnBinance();
        }
        
        
        
        
    }
    
    async function withdraw() {
        
        notify.open({ type: 'warning', message: 'Hold on! <br> Withdrawing your reward, please allow transaction when prompted' });
        $('#blockPageOverlay').show();
        try{
            
            let result =  await instance.mainContract.methods.withdraw().send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
            
            
            
            
            let hash = result;
            notify.dismissAll();
            $('#blockPageOverlay').hide();
            notify.success('Congrats! Successfully Withdrawn <br><a target="_blank" href="https://bscscan.com/tx/'+hash.transactionHash+'"><u>View transaction on bscscan</u></a>');
            reloadOnBinance();
                    
        }
        catch(error){
            notify.dismissAll();
            $('#blockPageOverlay').hide();
            notify.error('Oops! Something went wrong');
            reloadOnBinance();
        }
        
        
        
        
    }
    
    
    async function isActive(userAddress){
        let result = await instance.oldMainContract.methods.isActive(userAddress).call();
        console.log(result);
        if(!result){
            $('#oldContractWithdraw').css('display','none');
            return;
        }
        
    }

    //3 done for testing
    async function stake(amount, userAddress) {

        await setTokenBNX_LPAllowance(amount, mainContractAddress, userAddress);
        let _amount = web3.utils.toWei(amount);
        
        let rawTransaction = await instance.mainContract.methods.stake(liquidityContractAddress,_amount).send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
        
        return rawTransaction;
    }

    //4 done for testing
    async function withdrawReward() {
        let rawTransaction = await instance.mainContract.methods.withdrawReward(liquidityContractAddress).send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});

        return rawTransaction;
    }

    //5 done for testing
    async function unstake(amount, userAddress) { //todo check amount units;
        await setTokenBNX_LPAllowance(amount, mainContractAddress, userAddress);
        let _amount = web3.utils.toWei(amount);
        let rawTransaction = await instance.mainContract.methods.unstake(liquidityContractAddress,_amount).send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});

        return rawTransaction;
    }

    //6 done for testing
    async function setRefBackPerc(perc) {
        perc *= 100; 
        let rawTransaction = await instance.mainContract.methods.setRefback(perc).send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});

        return rawTransaction;
    }

    /********************************** CONTRACT READ METHODS ***************************************************/

    //7 done for testing
    async function getContractBalance() {
        let rawResult = await instance.mainContract.methods.getContractBalance().call({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
        console.log(rawResult);
        return rawResult;
    }

    //8 done for testing
    async function getContractBalanceRate() {
        let rawResult = await instance.mainContract.methods.getContractBalanceRate().call({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
    }

    //9 done for testing
    async function getSiteStats() {
        let rawResult = await instance.mainContract.methods.getSiteStats().call({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
        // let contractStakePercentRaw = await this.contract.contractStakePercent();
        // ethers.utils.formatUnits(BNBBalance._hex, "ether")
        let retrieved = {
            totalInvested: web3.utils.fromWei(rawResult[0]), 
            totalDeposits: parseInt(rawResult[1]),
            contractBalance: web3.utils.fromWei(rawResult[2]),
            contractPercent: (parseInt(rawResult[3]) / _PERCENTS_DIVIDER * 100)
            // contractStakePercent: Number.parseInt(contractStakePercentRaw._hex) / Config.PERCENTS_DIVIDER
        }

        return retrieved;
    }

/*****************************USER READ METHODS******************************************/

    //10 done for testing
    async function getUserDepositRates(userAddress) {
        let rawResult = await instance.mainContract.methods.getDepositsRates(userAddress).call({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
        
        return rawResult;
    } 

    //11 done for testing
    async function getUserDeposits(userAddress, last, first) {

        let rawResult = await instance.mainContract.methods.getUserDeposits(userAddress, last, first).call({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
        
        return rawResult;
    }


    //12 done for testing
    async function getUserStats(userAddress) {
        let rawResult = await instance.mainContract.methods.getUserStats(userAddress).call();
        
        
        let availableRewardFromStaking = await getAvailableRewardFromStaking(userAddress);
        
        let userDepositBonuses = await getUserDepositRates(userAddress);

        
        
        
        let retrieved = {
            userPerc: parseInt(rawResult[0]) / _PERCENTS_DIVIDER,
            userAvailab: web3.utils.fromWei(rawResult[1]),
            userDepsTotal: web3.utils.fromWei(rawResult[2]),
            userDeposits: parseInt(rawResult[3]),
            userWithdrawn: web3.utils.fromWei(rawResult[4]),
            basePercent: parseInt(userDepositBonuses[0]) / _PERCENTS_DIVIDER * 100,
            userHoldBonus: parseInt(userDepositBonuses[1]) / _PERCENTS_DIVIDER * 100,
            contractBonus: parseInt(userDepositBonuses[2]) / _PERCENTS_DIVIDER * 100,
            userVIPBonus: parseInt(userDepositBonuses[3]) / _PERCENTS_DIVIDER * 100,
            depositsArray:[],
            availableRewardFromStaking

        }


        //getUserDeposits accepts last deposit arg and first deposit arg. You need to enter 0 as last deposit arg and total number of deposits as first deposit arg.
        let depositsRaw = await getUserDeposits(userAddress, 0, retrieved.userDeposits);


        let deposits = [];
        
        
        for(let i = 0; i < retrieved.userDeposits; i++){
            const depositArr = Object.keys(depositsRaw).map((element) => parseInt(element[i])) 
            const depositObj = {
                depositedAmount: depositArr[0],
                withdrawnAmount: depositArr[1],
                rbackPerc: depositArr[2],
                depositMadeOn: depositArr[3],
            }

            deposits.push(depositObj);

        }
        retrieved.depositsArray = deposits.sort((a, b) => b.depositMadeOn - a.depositMadeOn);
        return retrieved;
    }
    
    async function getOldUserStats(userAddress) {
        let rawResult = await instance.oldMainContract.methods.getUserStats(userAddress).call();

        
            let retrieved = web3.utils.fromWei(rawResult[1]);


        return retrieved;
    }
    
    //13 done for testing
    async function getUser(userAddress) {
        let rawResult = await instance.mainContract.methods.users(userAddress).call();
        let retrieved = {
            checkpoint: rawResult[0],
            referrer: rawResult[1],
            bonus: web3.utils.fromWei(rawResult[2]),
            rbackPerc: rawResult[3] / _PERCENTS_DIVIDER * 100,
            refLevel: rawResult[4],
            refTurnover: Number(rawResult[5])
        }
        return retrieved;
    }

    //14 done for testing
    async function getUserReferralsStats(userAddress) {
        let rawResult = await instance.mainContract.methods.getUserReferralsStats(userAddress).call();
    
        let retrieved = {};
        //rawResult[0] - referrer's address
        //rawResult[1] - user.rbackPercent
        //rawResult[2] - users[user.referrer].rbackPercent
        //rawResult[3] - user.bonus
        //rawResult[4] - user.refs
        //rawResult[5] - user.refsNumber
        //rawResult[6] - user.refLevel
        //rawResult[7] - user.refTurnover

        const totalReferralsDeposit = Number(rawResult[4][0]);
        const totalReferrals = Number(rawResult[5][0]);
        retrieved = {
            usersRererrer: rawResult[0],
            userBackPercent: rawResult[1] / _PERCENTS_DIVIDER * 100,
            referrerBackPercent: rawResult[2] / _PERCENTS_DIVIDER * 100,
            userBonus: Number.parseInt(rawResult[3]),
            totalReferralsDeposit,
            totalReferrals,
            userRefLevel: Number.parseInt(rawResult[6]),
            userRefTurnover: Number.parseInt(rawResult[7]),
        }
        return retrieved;
    }
    
    async function getOldUserReferralsStats(userAddress) {
        let rawResult = await instance.oldMainContract.methods.getUserReferralsStats(userAddress).call();
    
        let retrieved = {};
        //rawResult[0] - referrer's address
        //rawResult[1] - user.rbackPercent
        //rawResult[2] - users[user.referrer].rbackPercent
        //rawResult[3] - user.bonus
        //rawResult[4] - user.refs
        //rawResult[5] - user.refsNumber
        //rawResult[6] - user.refLevel
        //rawResult[7] - user.refTurnover

        const totalReferralsDeposit = Number(rawResult[4][0]);
        const totalReferrals = Number(rawResult[5][0]);
        retrieved = {
            usersRererrer: rawResult[0],
            userBackPercent: rawResult[1] / _PERCENTS_DIVIDER * 100,
            referrerBackPercent: rawResult[2] / _PERCENTS_DIVIDER * 100,
            userBonus: Number.parseInt(rawResult[3]),
            totalReferralsDeposit,
            totalReferrals,
            userRefLevel: Number.parseInt(rawResult[6]),
            userRefTurnover: Number.parseInt(rawResult[7]),
        }
        return retrieved;
    }

/**************************USER STAKE READ METHODS********************************/
    //15 done for testing
    async function getAvailableRewardFromStaking(userAddress) {
        let rawResult = await instance.mainContract.methods.availableReward(userAddress, liquidityContractAddress).call();
        let retrieved = web3.utils.fromWei(rawResult);
        return retrieved;
    }

    //16 done for testing 
    async function getUserStakeDepositRate(userAddress, flipTokenAddress) {
        let rawResult = await instance.mainContract.methods.getUserStakeDepositRate(userAddress, liquidityContractAddress).call();
        return rawResult;
    }    

    //17 done for testing
    async function getUserStakePercentRate(userAddress) {
        let rawResult = await instance.mainContract.methods.getUserStakePercentRate(userAddress, liquidityContractAddress).call();
    } 

    //18 done for testing 
    async function  availableReward(userAddress) {
        let rawResult = await instance.mainContract.methods.availableReward(userAddress, liquidityContractAddress).call();
    }

    //19 MARKED







 /********* MAIN CONTRACT CLOSE ********/





//=====================================================================



                    // Liquidity Contract


//=================================================================

    //20 done for testing
    async function getReserves() {
        let rawResult = await instance.liquidityContract.methods.getReserves().call();
        let totalSupply = await instance.liquidityContract.methods.totalSupply().call();

        let retrieved = {
            BNBReserves: web3.utils.fromWei(rawResult[1]),
            BNXReserves: web3.utils.fromWei(rawResult[0]),
            flipTotalSupply: web3.utils.fromWei(totalSupply),
        }

        return retrieved;
    }

    //21 done for testing
    async function mintLiquidity() {
        let rawTransaction = await instance.liquidityContract.methods.mint("0x412dFCFC5608a6A3fdec70882cC01A5366E777fD").send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});

        let retrieved = await rawTransaction;


    }

    //22 done for testing
    async function getLPTokensBalance(userAddress) {
        let retrieved = await instance.liquidityContract.methods.balanceOf(userAddress).call();
        let x = web3.utils.fromWei(retrieved, "ether");
        return x; 
    }





        
        
        

        

        //27 done for testing 
        async function setTokenBNX_LPAllowance(amount, contract, userAddress) {

            let BN = web3.utils.BN;
            let _allowance = await instance.liquidityContract.methods.allowance(userAddress, contract).call();
            
            let allowance = web3.utils.fromWei(_allowance);
            
            if(Number(allowance) >= Number(amount)){
                return true;
            }else {
                
                let maxAllowance = new BN(2).pow(new BN(256)).sub(new BN(1));
                
                try{
                    let rawResult = await instance.liquidityContract.methods.approve(contract, maxAllowance).send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
                    let result = await rawResult;
                    reloadOnBinance();
                    
                    
                }catch(error){
                    reloadOnBinance();
                }
            }
             
        }




/*************** LIQUIDITY CONTRACT CLOSE **********/







//=====================================================================



                    // Router Contract


//===================================================================


        //24 done for testing
        async function addLiquidityETH(bnbAmount, bnxAmount, userAddress) {

          await setTokenBNXAllowance(bnxAmount, userAddress);

            
           bnbAmount = web3.utils.toWei(bnbAmount).toString();
           bnxAmount = web3.utils.toWei(bnxAmount).toString();

           

            const date = Math.floor(new Date().getTime() / 1000 + 3600);

            let rawResult = await instance.routerContract.methods.addLiquidityETH(tokenContractAddress, bnxAmount, "1", "1", userAddress, date).send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account, value:bnbAmount});

            return rawResult;

        }

        //25 done for testing 
        async function removeLiquidityETH(flipTokenAmount, userAddress) {
            //todo check router allowance for BNX tokens

            await setTokenBNX_LPAllowance(flipTokenAmount, routerContractAddress, userAddress);
            flipTokenAmount = web3.utils.toWei(flipTokenAmount).toString();
            
            const date = Math.floor(new Date().getTime() / 1000 + 3600);


            let rawResult = await instance.routerContract.methods.removeLiquidityETHSupportingFeeOnTransferTokens(tokenContractAddress, flipTokenAmount, "1", "1", userAddress, date).send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
           
            return rawResult;
        }
/********* RUOTER CONTRACT CLOSE*************/

     
//===================================================================



                    // Token Contract


//=================================================================


        //26 done for testing 
        async function setTokenBNXAllowance(amount, userAddress) {
            // let parsedAmount = ethers.utils.parseEther(`${amount}`).toString();
            
            let BN = web3.utils.BN;
            let _allowance = await instance.tokenContract.methods.allowance(userAddress, routerContractAddress).call();
            
            let allowance = web3.utils.fromWei(_allowance);
            // new BN(_allowance).toString();
            // web3.utils.fromWei();
            
            if(Number(allowance) >= Number(amount)){

                return true;
            }else {
                
                let maxAllowance = new BN(2).pow(new BN(256)).sub(new BN(1));
                try{
                    let rawResult = await instance.tokenContract.methods.approve(routerContractAddress, maxAllowance).send({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
                    let result = await rawResult;
                    reloadOnBinance();
                }catch(error){
                    reloadOnBinance();
                }

            }

            

        }
        


        //23 done for testing
        async function getBNXTokensBalance(userAddress) {
            let result = await instance.tokenContract.methods.balanceOf(userAddress).call();
            return web3.utils.fromWei(result, "ether");
            
        }

/******* TOKEN CONTRACT CLOSE ***********/



   
        
//#######################UI FUNCTION, REQUIRES AXIOS FOR PROMISE BASED API CALLING######################
/******************* UI FUNCTIONS *********************/
getLatestTrxToUsdRate();
        async function getLatestTrxToUsdRate() {
            let corsLink = "https://https://cors-anywhere.herokuapp.com/";
            let requestLink = `https://api.coincap.io/v2/assets/binance-coin`;
            let response = await axios.get(requestLink);
            return response.data.data.priceUsd;
        }

        function withoutRound(number, roundTo=2){
            if(roundTo === 2){
                if(number.toString().indexOf(".") !== -1){
 
                     const splittedNumber = number.toString().split(".")
                     splittedNumber[1]+="00";
                     number = splittedNumber.join(".");
 
                 return (number.toString()).match(/^-?\d+(?:\.\d{0,2})?/)[0]
                 }else {
                     number = number.toString()+".00";
                     return (number.toString()).match(/^-?\d+(?:\.\d{0,2})?/)[0]
                 }
            }else if(roundTo === 4){
                 if(number.toString().indexOf(".") !== -1){
 
                     const splittedNumber = number.toString().split(".")
                     splittedNumber[1]+="00";
                     number = splittedNumber.join(".");
 
                 return (number.toString()).match(/^-?\d+(?:\.\d{0,4})?/)[0]
                 }else {
                     number = number.toString()+".00";
                     return (number.toString()).match(/^-?\d+(?:\.\d{0,4})?/)[0]
                 }
        }
    }        





            function getDailyRewardFromDeposit(){
                return this.userStatsObj.userPerc && this.userStatsObj.userDepsTotal ? this.userStatsObj.userDepsTotal * (this.userStatsObj.userPerc / _PERCENTS_DIVIDER + 1) * _MULTIPLIER : 0;
            }
            function getDepositUserHoldBonus() {
                            return this.userStatsObj.userHoldBonus ? this.userStatsObj.userHoldBonus : 0;
                        }
            function getDepositUserVipBonus() {
                            return this.userStatsObj.userVIPBonus ? this.userStatsObj.userVIPBonus : 0;
                        }
                        
                        
                        
            function getDailyRewardFromStaking() {
                            return this.userStatsAndTokensBalanceData.userStakePerc && this.userStatsAndTokensBalanceData.stakeAmount ? this.userStatsAndTokensBalanceData.stakeAmount * (this.userStatsAndTokensBalanceData.userStakePerc / _PERCENTS_DIVIDER + 1) * _MULTIPLIER : 0;
                        }
            function getAvailableBNX() {
                            return this.userStatsAndTokensBalanceData.accumulatedReward && this.userStatsObj.availableRewardFromStaking ? Number(this.userStatsObj.availableRewardFromStaking) + Number(this.userStatsAndTokensBalanceData.accumulatedReward) : 0;
                        }
            function getUserTotalReferrals() {
                            return this.userReferralObj.totalReferrals ? this.userReferralObj.totalReferrals : 0;
                        }
            function getUserHoldBonus() {
                            return this.userStatsAndTokensBalanceData.userStakeHoldPerc ? this.userStatsAndTokensBalanceData.userStakeHoldPerc : 0;
                        }
            function getTotalCurrentBonuses() {
                            return this.getUserHoldBonus + 1 || 0;
                        }
            function getUserVipBonus() {
                            return this.userStatsAndTokensBalanceData.VipStakePerc ? this.userStatsAndTokensBalanceData.VipStakePerc : 0;
                        }
            function getUserLPBalance() {
                            return this.userStatsAndTokensBalanceData.LPBalance ? this.userStatsAndTokensBalanceData.LPBalance : 0;
                        }
            function getUserLPBalanceStakingPage() {
                            // return this.userStatsAndTokensBalanceData.LPBalance ? this.userStatsAndTokensBalanceData.LPBalance : 0;
                            return (this.userStatsAndTokensBalanceData.LPBalance && this.userStatsAndTokensBalanceData.stakeAmount) ? Number(this.withoutRound(this.userStatsAndTokensBalanceData.LPBalance)) + Number(this.userStatsAndTokensBalanceData.stakeAmount) : 0;
       
                        }
            function getUserBNXBalance() {
                            return this.userStatsAndTokensBalanceData.BNXBalance ? this.userStatsAndTokensBalanceData.BNXBalance : 0;
                        }
            function getUserPoolShare() {
                            return this.userStatsAndTokensBalanceData.LPBalance && this.userStatsAndTokensBalanceData.stakeAmount && this.reserves.flipTotalSupply
                                ? ((Number(this.userStatsAndTokensBalanceData.LPBalance) + Number(this.userStatsAndTokensBalanceData.stakeAmount)) / Number(this.reserves.flipTotalSupply)) * 100
                                : 0;
                        }
            function getStakedAmount() {
                return this.userStatsAndTokensBalanceData.stakeAmount ? this.userStatsAndTokensBalanceData.stakeAmount : 0;
            }
            function getUnstakedStakedAmount() {
                return (this.userStatsAndTokensBalanceData.LPBalance) ? (this.userStatsAndTokensBalanceData.LPBalance) : 0;
            }   
            
            function getTotalLiquidityUsd() {
                let rate = localStorage.getItem("rate");
                return rate && this.reserves.BNBReserves ? (rate * (this.reserves.BNBReserves) * 2) : 0;
             
            }
                        
                        
                        
                        
                        
                        
            function getUserRefLevel() {
                            return 0 === this.user.refLevel
                                ? 5
                                : 1 === this.user.refLevel
                                ? 7
                                : 2 === this.user.refLevel
                                ? 9
                                : 3 === this.user.refLevel
                                ? 11
                                : 4 === this.user.refLevel
                                ? 14
                                : 6 === this.user.refLevel
                                ? 16
                                : 7 === this.user.refLevel
                                ? 18
                                : 8 === this.user.refLevel
                                ? 20
                                : void 0;
                        }
            function getUserRefTurnover() {
                            return this.user.refTurnover ? this.userReferralObj.userRefTurnover / 10 ** 18 : 0;
                        }
            function getTotalLiquidity() {
                            return this.reserves.BNBReserves ? this.reserves.BNBReserves : 0;
                        }
                        
            
                function getBNXPriceChange() {
                            if (0 !== this.getBNXPrice()) {
                                // let currentRate = localStorage.getItem("rate");
                                // c.DEFAULT_BNX_PRICE = c.DEFAULT_BNX_PRICE * currentRate;
                                console.log(c.DEFAULT_BNX_PRICE);
                                if (this.getBNXPrice() < c.DEFAULT_BNX_PRICE) {
                                    let t = c.DEFAULT_BNX_PRICE - this.getBNXPrice();
                                    return "-" + ((t / c.DEFAULT_BNX_PRICE) * 100).toFixed(2);
                                }
                                {
                                    let t = this.getBNXPrice() - c.DEFAULT_BNX_PRICE;
                                    return "+" + ((t / c.DEFAULT_BNX_PRICE) * 100).toFixed(2);
                                    
                                }
                            }
                            return 0;
                        }
                function getBNXPrice() {
                            let t = localStorage.getItem("rate");
                            if (t) {
                                const e = Number(this.reserves.BNBReserves) / Number(this.reserves.BNXReserves);
                                return 1 * e ? 1 * e * t : 0;
                            }
                        }
                function getBNFDefaultPrice(){
                    let currentRate = localStorage.getItem("rate");
                    if(currentRate){
                        const tokenRatio = Number(this.reserves.BNBReserves) / Number(this.reserves.BNXReserves);
                        return 1 * tokenRatio ? 1 * tokenRatio * currentRate : 0;
                    }
                }
        function getLpToUsd() {
            const rate = localStorage.getItem('rate')
            const getTotalUSDLiquidity = rate && this.reserves.BNBReserves ? (rate * (this.reserves.BNBReserves) * 2) : 0

            return (this.getUserLPBalance() / this.reserves.flipTotalSupply) && getTotalUSDLiquidity ? (this.getUserLPBalance() / this.reserves.flipTotalSupply) * getTotalUSDLiquidity : 0
        }
        
        function bnbPerBnf(){
            let _BNBReserves = Number(reserves.BNBReserves);
            let _BNXReserves = Number(reserves.BNXReserves);
            let result = _BNBReserves / _BNXReserves;
            return result;
        }
        
        function bnfPerBnb(){
            let _BNBReserves = Number(reserves.BNBReserves);
            let _BNXReserves = Number(reserves.BNXReserves);
            let result = _BNXReserves / _BNBReserves;
            return result;
        }
        
        function calculateInputValues(){
            
            let onBnbChange = function(evt) {
            let inputValue = this.value;
            let rate = bnfPerBnb();
            let finalResult = inputValue * rate;
            if(finalResult !== 0){
                $('#bnfInput').val(parseFloat(finalResult).toFixed(4));
                let poolShare = possiblePoolShare(finalResult, inputValue);
                $('.possiblePoolShare').text(poolShare.toFixed(2));
            }else{
                $('#bnfInput').val('');
                
            }
            
            
            };
    
            let onBnfChange = function(evt) {
            let inputValue = this.value;
            let rate = bnbPerBnf();
            let finalResult = inputValue * rate;
            if(finalResult !== 0){
                $('#bnbInput').val(parseFloat(finalResult).toFixed(4));
                let poolShare = possiblePoolShare(finalResult, inputValue);
                $('.possiblePoolShare').text(poolShare.toFixed(2));
            }else{
                $('#bnbInput').val('');
                
            }
            
            
            };
    
            let bnbInput = document.getElementById('bnbInput');
            let bnfInput = document.getElementById('bnfInput');
            bnbInput.addEventListener('input', onBnbChange, false);
            bnfInput.addEventListener('input', onBnfChange, false);

        }
        
        function calcLiqInputPerc(target){
            let value = target.value;
            let userLpBalance = getUserLPBalance();
            let finalResult = (value / 100) * userLpBalance;
            $(target).addClass("active");
            $('.removeLiqPercBtns').find('button').not(target).removeClass("active");
            $('#removeLiquidityInput').val(withoutRound(finalResult));
            
        }
        
        function calcUnstakeInputPerc(target){
            let value = target.value;
            let stakedAmount = getStakedAmount();
            let finalResult = (value / 100) * stakedAmount;
            $(target).addClass("active");
            $('.unstakeBtns').find('button').not(target).removeClass("active");
            $('#unstakeInput').val(withoutRound(finalResult));
        }
        
        function possiblePoolShare(bnfValue, bnbValue){
            bnfValue = Number(web3.utils.toWei(String(bnfValue)));
            bnbValue = Number(web3.utils.toWei(String(bnbValue)));
            bnbReserve = Number(web3.utils.toWei(reserves.BNBReserves));
            bnfReserve = Number(web3.utils.toWei(reserves.BNXReserves));
            let totalToken = bnfValue + bnbValue;
            let totalReserves = bnfReserve + bnbReserve + totalToken;
            let result = (totalToken / totalReserves) * 100;
            return result;
        }
    async function removeStake(){
        let input = $('#unstakeInput').val();
        let bnbBalance = await web3.eth.getBalance(_account);
        bnbBalance = web3.utils.fromWei(bnbBalance);
        let staked = parseFloat($('.stakedAmount').text());
        
        if(staked > parseFloat(input) && parseFloat(bnbBalance) >= 0.01){
            notify.open({ type: 'warning', message: 'Hold on! <br> Unstaking, please allow transaction when prompted' });
            $('#blockPageOverlay').show();
            try{
                let hash = await unstake(input, _account); 
                notify.dismissAll();
                $('#blockPageOverlay').hide();
                notify.success('Unstaked Successfully! <br><a target="_blank" href="https://bscscan.com/tx/'+hash.transactionHash+'"><u>View transaction on bscscan</u></a>');
                reloadOnBinance();
            }catch(error){
                notify.dismissAll();
                $('#blockPageOverlay').hide();
                notify.error('Oops! Something went wrong');
                reloadOnBinance();
            }
        }
        else{
            notify.error('Re-check your balance and input');
        }
        
        
    }
    
    async function addStake(){
        let input = $('#stakeInput').val();
        let bnbBalance = await web3.eth.getBalance(_account);
        bnbBalance = web3.utils.fromWei(bnbBalance);
        let unstaked = parseFloat($('.unstakedStakedAmount').text());
        
        if(unstaked >= parseFloat(input) && parseFloat(bnbBalance) >= 0.01){
            notify.open({ type: 'warning', message: 'Hold on! <br> Staking, please allow transaction when prompted' });
            $('#blockPageOverlay').show();
            try{
                let hash = await stake(input, _account); 
                notify.dismissAll();
                $('#blockPageOverlay').hide();
                notify.success('Congrats! Staked Successfully <br><a target="_blank" href="https://bscscan.com/tx/'+hash.transactionHash+'"><u>View transaction on bscscan</u></a>');
                reloadOnBinance();
            }catch(error){
                notify.dismissAll();
                $('#blockPageOverlay').hide();
                notify.error('Oops! Something went wrong');
                reloadOnBinance();
            }
        }
        else{
            notify.error('Re-check your balance and input');
        }
        
    }
    
    async function getUserTotalDeposits(userAddress){
        let rawResult = await instance.mainContract.methods.getUserTotalDeposits(userAddress).call();
        let result = web3.utils.fromWei(rawResult);
        return result;
    }
    
    async function getTotalInvested() {
          return this.siteStatsObj.totalInvested ? (this.siteStatsObj.totalInvested) : 0;
    }
    async function getTotalDeposits() {
          return this.siteStatsObj.totalDeposits ? this.siteStatsObj.totalDeposits : 0;
    }
    
    function isBinance(){
        if(localStorage.getItem("selectedWallet") === "binance"){
            return true;
        }
        return false;
    }
    
    function reloadOnBinance(){
        if(isBinance()){
            virtualReload();
            return true;
        }
        return false;
    }
    
    async function withdrawBnfTokens(){
        notify.open({ type: 'warning', message: 'Hold on! <br> Withdrawing your reward, please allow transaction when prompted' });
        $('#blockPageOverlay').show();
        try{
            let result = await withdrawReward();
            let hash = result;
            notify.dismissAll();
            $('#blockPageOverlay').hide();
            notify.success('Congrats! Successfully Withdrawn <br><a target="_blank" href="https://bscscan.com/tx/'+hash.transactionHash+'"><u>View transaction on bscscan</u></a>');
            reloadOnBinance();
                    
        }
        catch(error){
            notify.dismissAll();
            $('#blockPageOverlay').hide();
            notify.error('Oops! Something went wrong');
            reloadOnBinance();
        }
    }
    
    function isLogged(){
        if(localStorage.getItem("selectedWallet") != null){
            return true;
        }
        return false;
    }
    
    async function addBnfToWallet(){
        const tokenAddress = tokenContractAddress; //'0xc323049E44B8eC55A9a4eB4d3774a2C65A68335e' 10-07-21
        const tokenSymbol = 'BNF';
        const tokenDecimals = 18;
        const tokenImage = 'https://bnbfarm.io/img/bnbfarmtoken.png';


        try {
          // wasAdded is a boolean. Like any RPC method, an error may be thrown.
          const wasAddedBnf = await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Initially only supports ERC20, but eventually more!
              options: {
                address: tokenAddress, // The address that the token is at.
                symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                decimals: tokenDecimals, // The number of decimals in the token
                image: tokenImage, // A string url of the token logo
              },
            },
          });
         

          if (wasAddedBnf) {
            notify.success("BNF was added successfully!");
          } else {
            console.log('Your loss!');
          }
        } catch (error) {
          console.log(error);
        }
    }
    
    async function addBnfLpToWallet(){
        
        
        const lptokenAddress = liquidityContractAddress; //'0x700F99430aCDE9e16eBd8Ad126D6ee5d4454771a' 10-07-21
        const lptokenSymbol = 'BNF-LP';
        const lptokenDecimals = 18;
        const lptokenImage = 'https://bnbfarm.io/img/bnbfarm_lp_token.png';

        try {
          // wasAdded is a boolean. Like any RPC method, an error may be thrown.
          const wasAddedLp = await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Initially only supports ERC20, but eventually more!
              options: {
                address: lptokenAddress, // The address that the token is at.
                symbol: lptokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                decimals: lptokenDecimals, // The number of decimals in the token
                image: lptokenImage, // A string url of the token logo
              },
            },
          });

          if (wasAddedLp) {
            notify.success("BNF-LP was added successfully!");
          } else {
            console.log('Your loss!');
          }
        } catch (error) {
          console.log(error);
        }
    }
    
    function copyToClipboard(id){
        var copyText = document.getElementById(id);
        if(copyText.value !== "No Link"){
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            notify.success("Copied <br> Share more, earn more!");
        }
        else{
            notify.error("You must have deposited some BNB to unlock your shareable link!");
        }
        
    }
    
    function newCopyToClipboard(text){
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        notify.success("Copied successfully!");
    }
    
    async function getUserBadgeStats(){
        let result = await instance.mainContract.methods.getUserBadgeStats().call({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
        return result;
    }
    function isFromMobile(){
        let checkIfLoadedFromMobile = $('.mobile-menu-button').is(':visible');
        console.log(checkIfLoadedFromMobile);
        return checkIfLoadedFromMobile;
    }
    
    async function getUserDirect(userAddress){
        let result = await instance.mainContract.methods.getUserDirect(userAddress).call({shouldPollResponse: false, feeLimit: 50000000, callValue: 0, from: _account});
        return result;
    }
    
    function showUserStatsModal(){
        $("#refStatsModal").show();
    }
    async function getUserRefsNumber(userAddress){
        let refStats = await instance.mainContract.methods.getUserReferralsStats(userAddress).call({shouldPollResponse: false, feeLimit: 5000000, callValue: 0, from: _account});
        let refsNumber = refStats[5];
        console.log(refsNumber);
        return refsNumber;
    }
    async function setUserRefsNumber(userAddress){
        let refsNumber = await getUserRefsNumber(userAddress);
        let levelArr = ["#level1","#level2","#level3","#level4","#level5","#level6","#level7","#level8"];
        let levelClassArr = [".level1",".level2",".level3",".level4",".level5",".level6",".level7",".level8"];
        // $().
        console.log(typeof(refsNumber));
        console.log(refsNumber);
        console.log(typeof(refsNumber[0]));
        for(count = 0; count < 8; count++){
            $(levelArr[count]).text(refsNumber[count]);
            if(parseInt(refsNumber[count]) > 0){
                $(levelClassArr[count]).addClass('buttonMark');
                $(levelClassArr[count]).removeClass('mark');
            }
        }
    }






