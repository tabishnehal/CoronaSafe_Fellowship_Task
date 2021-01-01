var fs = require('fs');
var d = new Date();
var y = d.getUTCFullYear();
var m = d.getUTCMonth() + 1;
var date = d.getUTCDate();
if (m<10) m = '0' + m;
if (date<10) date = '0' + date;
var dateFormat = y+'-'+m+'-'+date;
var arg = process.argv.slice(2);
var length = arg.length;

// Usage
if (arg[0] == 'help' || length == 0){
console.log('Usage :-\n$ ./todo add "todo item"  # Add a new todo\n$ ./todo ls               # Show remaining todos\n$ ./todo del NUMBER       # Delete a todo\n$ ./todo done NUMBER      # Complete a todo\n$ ./todo help             # Show usage\n$ ./todo report           # Statistics');
}
else if (arg[0] == 'ls'){
	fs.readFile('todo.txt', function(err,data){
		if (err){
			console.log('There are no pending todos!');
		}
		else{
			var content = data.toString();
			var result = content.split('\n');
			var total_line = result.length;
			for(var i=total_line-2; i>=0;i--){
				console.log('['+(i+1)+'] '+result[i]);
			}
		}
	});
} //report
else if (arg[0] == 'report'){
	fs.readFile('todo.txt', function(err,todo){
			if (err) throw err;
			var content_todo = todo.toString();
			var result_todo = content_todo.split('\n');
			var pending = result_todo.length - 1;
			fs.readFile('done.txt', function(err,done){
				if (err) throw err;
				var content_done = done.toString();
				var result_done = content_done.split('\n');
				var completed = result_done.length - 1;
				console.log(`${dateFormat} Pending : ${pending} Completed : ${completed}`);
		});
	});
} // del NUMER
else if (arg[0] == 'del' && length>1){
	fs.readFile('todo.txt', function(err,data){
			if (err) throw err;
			var content = data.toString();
			var result = content.split('\n');
			var total_line = result.length;
			var contentAfterdel = '';
			var entryFound = 0;
			for(var i=0; i<total_line-1;i++){
				if (i+1 != arg[1]){
					contentAfterdel+=result[i]+'\n'; 
				}
				if (i+1 == arg[1]){
					entryFound = 1;
				}
			}
			fs.writeFile('todo.txt',contentAfterdel,function(err){
				if (err) throw err;
			});
			if (entryFound) console.log('Deleted todo #'+arg[1]);
			else console.log(`Error: todo #${arg[1]} does not exist. Nothing deleted.`);
	});
} // del NUMBER missing
else if (arg[0] == 'del' && length == 1){
	console.log('Error: Missing NUMBER for deleting todo.');
} // add NUMBER
else if (arg[0] == 'add' && length>1){
	for(var add_no = 1; add_no<length; add_no++){
		fs.appendFile('todo.txt', arg[add_no]+'\n', function(err){
			if (err) throw err;
		});
		console.log('Added todo: "'+ arg[add_no] +'"');
	}
} // add NUMBER missing
else if (arg[0] == 'add' && length == 1){
	console.log('Error: Missing todo string. Nothing added!');
} // done NUMBER
else if (arg[0] == 'done' && length>1){
	fs.readFile('todo.txt', function(err,data){
			if (err) throw err;
			var content = data.toString();
			var result = content.split('\n');
			var total_line = result.length;
			var contentAfterdel = '';
			var entryFound = 0;
			for(var i=0; i<total_line-1;i++){
				if (i+1 != arg[1]){
					contentAfterdel+=result[i]+'\n'; 
				}
				if (i+1 == arg[1]){
					entryFound = 1;
				}
			}
			fs.writeFile('todo.txt',contentAfterdel,function(err){
				if (err) throw err;
			});
			if (entryFound){
				var record = arg[1]+' '+dateFormat+' '+result[arg[1]-1]; 
				fs.appendFile('done.txt', record+'\n', function(err){
					if (err) throw err;
				});
				console.log(`Marked todo #${arg[1]} as done.`);
			}
			else{
				console.log(`Error: todo #${arg[1]} does not exist.`);
			}
	});
} // done NUMBER missing
else if (arg[0] == 'done' && length == 1){
	console.log('Error: Missing NUMBER for marking todo as done.');
}
else{
console.log('Error');
}

