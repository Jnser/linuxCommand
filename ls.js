const fs = require("fs");
const colors = require("colors");
const path = require("path");

var fileJson = preDeal(process.argv);

if(fileJson.exist) {
	if(fileJson.folder) {
		fs.readdir(fileJson.root, (err, files) => {
			if(err) {
				console.log(err.message);
			} else {
				//不考虑隐藏文件
				var displayFiles = files.filter((item) => {
					return !item.startsWith(".");
				});
				//此处报错的问题在于，item得到的事文件夹名字，stat需要的是完整的路径
				var dirFiles = displayFiles.filter((item) => {
					return fs.statSync(fileJson.root + "/" + item)
						.isDirectory();
				});
				var comFiles = displayFiles.filter((item) => {
					return fs.statSync(fileJson.root + "/" + item)
						.isFile();
				});
				//文件夹蓝色，普通文件黑色
				dirFiles.forEach((item) => {
					process.stdout.write(item.blue + "\t");
				});
				comFiles.forEach((item) => {
					process.stdout.write(item.black + "\t");
				});
			}
		});
	} else {
		console.log(path.join(fileJson.root, fileJson.base)
			.red);
	}
} else {
	console.log("Error: no such file or directory -> " + path.join(fileJson.root, fileJson.base)
		.red);
}


/*
返回命令行参数的处理结果json
{
	exist  : true   文件或文件夹是否存在
	folder : true   是文件夹
	root   : string  文件夹返回处理好的路径名（相对转绝对）
	base   : string		文件名
}
 */
function preDeal(argvArray) {
	var res = {
		"exist": false,
		"folder": false,
		"root": "",
		"base": ""
	};
	if(argvArray[2] == undefined) {
		res.exist = true;
		res.folder = true;
		res.root = path.resolve("."); //相对转绝对
	} else {
		var fileUrl = argvArray[2];
		var exist = fs.existsSync(fileUrl);
		if(exist) {
			res.exist = true;
			fileUrl = path.resolve(fileUrl);
			var isFile = fs.statSync(fileUrl)
				.isFile();
			if(isFile) {
				res.folder = false;
				res.root = path.dirname(fileUrl);
				res.base = path.basename(fileUrl);
			} else {
				res.folder = true;
				res.root = fileUrl;
				res.base = "";
			}
		} else {
			res.exist = false;
			res.folder = false;
			res.root = path.dirname(fileUrl);
			res.base = path.basename(fileUrl);
		}
	}
	return res;
}
