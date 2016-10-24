(function(){
    var Calligraphy = {
        init: function(config){
            var self = this;
            self.canvas = document.getElementById(config.id);
            self.canvas.width = document.documentElement.clientWidth * .9;
            self.canvas.height = document.documentElement.clientWidth * .9;
            self.ctx = self.canvas.getContext('2d');
            self.ctx.fillStyle = config.style;
            self.lineMax = config.lineMax;
            self.lineMin = config.lineMin;
            self.radius = config.radius;
            self.moveFlog = false;
            self.hasEvent = [];
            self.upEvent = {};
            self.smoothness = 80;
            self.linePressure = 1;
            self.eventhanding();
        },
        eventhanding: function(){
            var self = this;
            self.canvas.addEventListener('touchstart',function(e){
                e.preventDefault();
                e = e.changedTouches[e.changedTouches.length-1];
                self.moveFlog = true;
                self.hasEvent = [];
                self.upEvent = self.getXY(e);
            },false)
            self.canvas.addEventListener('touchmove',function(e){
                e.preventDefault();
                e = e.changedTouches[e.changedTouches.length-1];
                self.drawFont(self.getXY(e));
                //self.drawDemo(self.getXY(e));
                self.WxMsgShow(self.getXY(e));
            },false)
            self.canvas.addEventListener('touchend',function(e){
                e.preventDefault();
                self.moveFlog = false;
            },false)
        },
        drawDemo: function(msg){
            var self = this;
            var up = self.upEvent;
            var dis = self.getDistance(up,msg);
            var len = Math.round(dis);
            for(var i = 0;i<len;i++){
                var x = self.upEvent.x + (msg.x - up.x)/len*i,
                    y = self.upEvent.y + (msg.y - up.y)/len*i;
                self.ctx.beginPath();
                self.ctx.arc(x,y,5,0,2*Math.PI,true);
                self.ctx.fill();
            }
            self.upEvent = msg;
        },
        drawFont: function(msg){
            if(!this.moveFlog)
                return;
            var self = this,
                moEvent = msg,
                upEvent = self.upEvent,
                upRadius = self.radius,
                dis = 0,
                time = 0;
            self.hasEvent.unshift({time:new Date().getTime(),dis:self.getDistance(upEvent,moEvent)});
            for (var n = 0; n < self.hasEvent.length-1; n++) {
                dis += self.hasEvent[n].dis;
                time += self.hasEvent[n].time-self.hasEvent[n+1].time;
                if (dis>self.smoothness)
                    break;
            }
            var or = Math.min(time/dis*self.linePressure+self.lineMin , self.lineMax) / 2;
            self.radius = or;
            self.upEvent = moEvent;
            //if (self.hasEvent.length<=4)
            //    //return;
            var len = Math.round(self.hasEvent[0].dis/2)+1;
            for (var i = 0; i < len; i++) {
                var x = upEvent.x + (moEvent.x-upEvent.x)/len* i,
                    y = upEvent.y + (moEvent.y-upEvent.y)/len* i,
                    r = upRadius + (or-upRadius)/len*i;
                self.ctx.beginPath();
                self.ctx.arc(x,y,r,0,2*Math.PI,true);
                self.ctx.fill();
            }
        },
        WxMsgShow:function(msg){
            var $msg = document.getElementById('MsgBox');
            $msg.innerHTML = 'x: '+msg.x+'<br />'+'y: '+msg.y;
        },
        getXY: function(e){
            var self = this;
            return {
                x: e.clientX - self.canvas.offsetLeft + (document.body.scrollLeft || document.documentElement.scrollLeft),
                y: e.clientY - self.canvas.offsetTop + (document.body.scrollLeft || document.documentElement.scrollTop),
            }
        },
        getDistance: function(pre,next){
            var x = next.x - pre.x,
                y = next.y - pre.y;
            return Math.sqrt(x*x + y*y);
        }
    }
    var config = {
        id:'CanvasId',
        style : 'rgba(0,0,0,1)',
        lineMin:3,
        lineMax:20,
        radius:0,
    }
    Calligraphy.init(config);
})()