# flowJs 简单的流控制框架

## 使用方法
```javascript
var foo = flowJS({
	init: function( flow ){
		flow.nextStep( this.step1, this.step2, ' world' )
			 .nextStep( this.step1, this.error, ' aaa')
		console.log(`初始化flow, 传值-world, 3000ms后执行下一步....`)
		setTimeout(function(){
		       flow.resolve('hello')//改变状态为RESOLVE传值
		}, 3000)
	},
	step1: function( flow, data, p ){
		console.log(`当前执行：step1, 接收值-${p}，立即执行下一步....`)
                  flow.flowData(data + p)//不改变状态传值
                  flow.nextStep(this.step2)
	},
	step2: function( flow, data ){
		var me = this;
		console.log(`当前执行：step2, 接收值-${data}, 2000ms后执行下一步....`)
    			flow.lock()//加锁保留状态
                  setTimeout(function(){
                        flow.unlock(data)//去锁恢复状态
                        flow.nextStep(me.step3, me.error)
                  }, 2000)
	},
	step3: function( flow, data ){
		console.log(`当前执行：step3, data-${data}, 执行完毕....`)
	},
	error: function(flow, data){
		console.log(data)
	}
})
```
