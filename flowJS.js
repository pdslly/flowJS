 (function(win){
      "use strict"
      function assert(condition, msg){
            if(!condition) throw new Error('flowJS: '+msg)
      }
      function flowJS(opt){
            return new flowJS.prototype.init(opt)
      }
      function Handle( resolveFn, rejectFn, arg ){
            this.resolveFn = typeof resolveFn === 'function' ? resolveFn : null;
            this.rejectFn = typeof rejectFn === 'function' ? rejectFn : null;
            this.arg = arg;
      }
      function handle( flow, handle ){
            var cb;
            if( flow.$status === 0 ){
	flow.$deferred.push( handle )
	return;
            }
            cb = flow.$status === 1 ? handle.resolveFn : handle.rejectFn;
            if( cb === null ){
                  ( flow.$status === 1? flow.resolve : flow.reject )( flow.$data )
                  return;
            }
            try{
                  cb.apply( flow.$opt, [].concat(flow, flow.$data, handle.arg) )
            }catch( e ){
                  flow.reject( e )
                  return;
            }
            flow.resolve( flow.$data )
      }
      function finale( flow ){
            var hand;
            if( flow.$status === 2 && flow.$deferred.length === 0 ){
      	setTimeout(function(){
      	     throw new Error(flow.$data)
      	})
            }
            for( ; hand = flow.$deferred.shift();  ){
      	handle( flow, hand )
            }
      }
      function doResolve( opt, flow ){
            try{
      	opt.init( flow )
            }catch(e){
      	flow.reject( e, flow )
            }
      }
      flowJS.prototype = {
            init: function(opt){
      	this.$opt = opt;
      	this.$data = null;
      	this.$status = 0;
      	this.$deferred = [];
      	assert( opt.init, 'initial function nodt exist!' )
      	doResolve( opt, this )
            }
      }
      flowJS.prototype.init.prototype = {
            nextStep: function( resolveFn, rejectFn ){
      	var args = [].slice.call(arguments), 
      	      type$1 = typeof resolveFn,
      	      type$2 = typeof rejectFn,
      	      len = args.length;

                   assert( len > 0, 'nextStep params size can not less than 1!' )
                   assert( type$1 === 'function', 'nextStep params one must be function!' )
                   args.shift()
      	if( type$2 === 'function' ){
                          args.shift()
                   }else{
      	       rejectFn = null
      	}
      	if( this.$status === 0 ){
      	       handle( this, new Handle(  resolveFn, rejectFn, args ) )
      	}else{
                          if( this.$status === 1 ){
                                resolveFn.apply(this.$opt, [].concat(this, this.$data, args))
                          }else{
                                rejectFn ? rejectFn.apply(this.$opt, [].concat(this, this.$data, args)) : this.reject(this.$data)
                          }
      	}
                   return this;
            },
            getData: function(key){
      	if(key){
      	       assert( typeof key === 'string', 'params must be string!' )
      	       return (typeof this.$data === 'object' && this.$data != null) ? this.$data[key] : undefined
      	}
      	       return this.$data
      	},
            setDate: function(data){
      	this.$data = data
            },
            lock: function(){
                   this.$cacheStatus = this.$status;
      	this.$status = 0;
            },
            resolve: function( data ){
            	this.$status = 1;
            	this.flowData(data)
            },
            reject: function( data ){
      	this.$status = 2;
            	this.$data = data;
            	finale( this )
            },
            flowData: function(data){
                   this.$data = data;
                   try{
                         finale( this )
                   }catch(e){
                         this.reject( e )
                   }
            },
            unlock: function(data){
                  this.$status = this.$cacheStatus;
                  this.flowData(data)
            }
      }
      win.flowJS = flowJS
})(window)