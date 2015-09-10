
var link = {
		//url: "http://10.212.101.33/enotes/"
		url: "http://portal.onl.co.id/enotes/"
};

//GENERAL FUNCTION
function fungsi() {
	ceklogin();
	general();
}

function login(){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	var tgl_b=[];		
	username = $('#username').val();
	password = $('#password').val();
	if(username!='' && password!=''){
		if(username.length==5 || username.length==7){
			
		
			$.ajax ({
				type: 'get',
				url: link.url+"server.php",
				dataType: "json",
				data : "request=login&username="+username+"&password="+password+"&REG_ID="+window.localStorage['REG_ID'],
				success:function(data){	
					if(data.status!="fail"){
						window.localStorage["login"] = "user";
						window.localStorage["npp"] = data.npp;
						window.localStorage["nama"] = data.nama;
						//window.localStorage["kdwil"] = data.kdwil;
						//window.localStorage["singkatan"] = data.singkatan;
						
						//cek 
						if(data.special=="admin"){
							window.localStorage["priviledge"] = "admin";
						} else {
							window.localStorage["priviledge"] = "user";
						}
						
						window.location = "home.html";
						
						
						
					} else {
						alert('Username dan Password salah!');
					}
				},
				error: function(data){
					alert('Terjadi kesalahan login');
				}	
			});	
		} else {
			alert('Username dan Password salah!');
		}
	} else {
		alert('Username dan Password tidak boleh kosong!');
	}
}

function ceklogin(){
	
	if(window.localStorage["login"] == undefined) {
		window.location = "index.html";
	} else {
	
	}
}

function ceksesi(){
	
	if(window.localStorage["login"] == undefined) {
	
	} else {
		window.location = "home.html";
	}
}

function logout(){
	window.localStorage.clear();
	window.location = "index.html";
}

function general(){
	//display notes masuk if login != P020833
	
	//if(window.localStorage["priviledge"]!="admin"){
		
	var notesMasuk = '<ul class="nav navmenu-nav">\
			<li><a href="pesan_masuk.html" rel="external"><span class="glyphicon glyphicon-envelope"></span> Notes Masuk <span id="countNotes"></span></a></li>\
		</ul>';
	$("#notesMasuk").html(notesMasuk);
	/* } else {
		var notesMasuk = '';
		$("#notesMasuk").html(notesMasuk);
	} */
	
	//get jumlah notes masuk unread
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=countNotes&npp="+window.localStorage["npp"],
		success:function(data){	
			if(data.status!="fail"){
				countNotes = data.countNotes;
				if(countNotes>0){
					$('#countNotes').html('('+countNotes+')');
				}
			} else {
				alert('Tidak ada data');
			}
		},
		error: function(data){
			alert('Terjadi kesalahan, koneksi internet putus');
		}	
	});
	
	//get timeline unread
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=countTimeline&npp="+window.localStorage["npp"],
		success:function(data){	
			if(data.status!="fail"){
				countTimeline = data.countTimeline;
				if(countTimeline>0){
					$('#countTimeline').html('('+countTimeline+')');
				}
			} else {
				alert('Tidak ada data');
			}
		},
		error: function(data){
			//alert('Terjadi kesalahan');
		}	
	});
	
	//VIEW
	$('#getnama').html(window.localStorage["nama"]);
	
	
}
//GENERAL FUNCTION


//ALL FUNCTION

function dashboard(){
	
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=getDashboard&REG_ID="+window.localStorage['REG_ID']+"&npp="+window.localStorage['npp'],
		success:function(data){	
			var view = "";
			view = view +'<h2 style="margin-left:10px">Kantor Pusat</h2>';
			
			$.each(data, function(i,n){
				var persen = n["notcompleted"]/n["jumlah"]*100;
				if(!persen){
					persen = 0;
				} else {
					persen = Math.round(persen).toFixed(0);
				}
				
				if(n["wilayah"]=="KP"){
					view = view +'<a onclick="gotoDivisi(0, \'KP\')">\
					<div class="col-md-3 col-sm-6 col-xs-6">\
						<div class="info-box kp">\
							<span class="info-box-icon">KP</span>\
							<div class="info-box-content">\
								<span class="info-box-text">Notes</span>\
								<span class="info-box-number">'+n["jumlah"]+'</span>\
								<div class="progress">\
													<div class="progress-bar" style="width: '+persen+'%"></div>\
												</div>\
												<span class="progress-description">\
													'+persen+'% Completed\
												</span>\
											</div>\
										</div>\
									</div>\
								</a>\
					<br><br><br><br><br><br><h2 style="margin-left:10px">Wilayah</h2>\
					';
				}
				
				if(n["wilayah"]!="KP"){
					
				
				
				view = view +'<a onclick="gotoDivisi('+n["wil_id"]+',\'' +n["wilayah"]+ '\')">\
				<div class="col-md-3 col-sm-6 col-xs-6">\
					<div class="info-box '+n["wilayah"].toLowerCase()+'">\
						<span class="info-box-icon">'+n["wilayah"]+'</span>\
						<div class="info-box-content">\
							<span class="info-box-text">Notes</span>\
							<span class="info-box-number">'+n["jumlah"]+'</span>\
							<div class="progress">\
												<div class="progress-bar" style="width: '+persen+'%"></div>\
											</div>\
											<span class="progress-description">\
												'+persen+'% Completed\
											</span>\
										</div>\
									</div>\
								</div>\
							</a>';
				}
			});
			$("#view").html(view);
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
}

function divisi(){
	
	
	
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	
	if(window.localStorage['wilayah']=="KP"){
		$("#getDivisi").html("Kantor Pusat");
		var tabvar = 'Divisi';
	} else {
		$("#getDivisi").html("Wilayah "+window.localStorage['wilayah']);
		var tabvar = 'Wilayah';
	}
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=getDivisi&kdwil="+window.localStorage['kdwil'],
		success:function(data){	
			var view = "";
			/* view = view +'<table class="table table-hover table-pesan">\
                      <thead>\
                        <tr>\
                          <th rowspan="2" style="vertical-align:middle">'+tabvar+'</th>\
                          <th style="text-align:center" colspan="3">Status</th>\
                        </tr>\
						<tr>\
							<th>Jumlah Notes</th>\
							<th>Complete</th>\
							<th>Not Complete</th>\
						</tr>\
                      </thead>\
                      <tbody>'; */
			
			$.each(data, function(i,n){
				if(n["jumlah"]==0){
					completed = 0;
				} else {
					completed = n["completed"]/n["jumlah"]*100;
					completed = Math.round(completed).toFixed(0);
				}
				
				view = view +'\
				<div style="border:1px" class="col-md-3 col-sm-6 col-xs-6 text-center" onclick="gotoNotes('+n['id_divisi']+',\'' + n['nama_divisi'] + '\')">\
					  <div class="knob-label"><h3><b>'+n["nama_divisi"]+'</b></h3><h5>'+n["jumlah"]+' Notes</h5></div>\
                      <input type="text" class="knob" value="'+completed+'" data-width="90" data-height="90" data-fgColor="#3c8dbc" data-readonly="true" style="float:left"/>\
					  \
                    </div>';
					
			});
			
			$("#view").html(view);
			$(".knob").knob({
			  draw: function () {

				// "tron" case
				if (this.$.data('skin') == 'tron') {

				  var a = this.angle(this.cv)  // Angle
						  , sa = this.startAngle          // Previous start angle
						  , sat = this.startAngle         // Start angle
						  , ea                            // Previous end angle
						  , eat = sat + a                 // End angle
						  , r = true;

				  this.g.lineWidth = this.lineWidth;

				  this.o.cursor
						  && (sat = eat - 0.3)
						  && (eat = eat + 0.3);

				  if (this.o.displayPrevious) {
					ea = this.startAngle + this.angle(this.value);
					this.o.cursor
							&& (sa = ea - 0.3)
							&& (ea = ea + 0.3);
					this.g.beginPath();
					this.g.strokeStyle = this.previousColor;
					this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
					this.g.stroke();
				  }

				  this.g.beginPath();
				  this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
				  this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
				  this.g.stroke();

				  this.g.lineWidth = 2;
				  this.g.beginPath();
				  this.g.strokeStyle = this.o.fgColor;
				  this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
				  this.g.stroke();

				  return false;
				}
			  }
			});
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
	
}

function notes(){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	
	if(window.localStorage["wilayah"]=="KP"){
		$("#getDivisi").html("<b>Kantor Pusat</b> - Divisi <b>"+window.localStorage["nama_divisi"]+"</b>");
	} else {
		$("#getDivisi").html("Wilayah <b>"+window.localStorage["wilayah"]+"</b> - Cabang <b>"+window.localStorage["nama_divisi"]+"</b>");
	}
	
	//if(window.localStorage['priviledge']=="admin"){
		
		$("#viewButtonNotes").html('<a href="pesan_baru.html" rel="external"><input type="button" class="btn btn-primary" value="Buat Notes"></a>');
	//}
	
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=getNotes&id_divisi="+window.localStorage['id_divisi']+"&id_notes",
		success:function(data){	
			var view = "";
			
			
			view = view + '<table class="table table-hover table-pesan"><tbody data-link="row" class="rowlink">';
			if(data!=""){
				$.each(data, function(i,n){
					
					if(n["status"]=='C'){
						var status = '<span class="label label-success" style="font-size:14px">Completed</span>';
					} else {
						var status = '<span class="label label-danger" style="font-size:14px">Not Completed</span>';
					}
					
					
					view = view +'<tr>\
						<td><a onclick="gotoDetailNotes('+n["id_notes"]+')">To : <b>'+n["kepada"]+'</b></a></td>\
						<td><a onclick="gotoDetailNotes('+n["id_notes"]+')">CC : <b>'+n["cc"]+'</b></a></td>\
						<td><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+n["perihal"]+' ......</a></td>\
						<td width="20%"><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+n["tanggal"]+'</a></td>\
						<td><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+n["persen"]+'% </a></td>\
						<td><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+status+' </a></td>\
					</tr>';
				});
			} else {
			view = view + "<tr ><td class='alert alert-warning' colspan='6'>Tidak ada Notes</td></tr>";
			}
			
			view = view + "</tbody></table>";
			
			$("#view").html(view);
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
}

function notes_detail(){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=getNotes&id_notes="+window.localStorage['id_notes'],
		success:function(data){	
			//VIEW
			
			var view = "";
			
			$.each(data, function(i,n){
				if(n["status"]=='C'){
					var status = '<span class="label label-success" style="font-size:14px">Completed</span>';
				} else {
					var status = '<span class="label label-danger" style="font-size:14px">Not Completed</span>';
				}
				
				var kepada = n["nppKepada"].split(",");
				var jmlKepada = kepada.length;
				
				
				
				//update persen sendiri
				if(n['NPPdari']==window.localStorage['npp'] || window.localStorage["priviledge"]=="admin"){
					var persen = '<input type="text" style="width:50px; height:40px; font-size:20px;" id="persen" value="'+n["persen"]+'"> %<br><br>\
					<a onclick="updatePersen('+n["id_notes"]+')" class="btn btn-primary">Update</a>';
						
				} else {
					//alert(jmlKepada);
					for(var x=0;x<jmlKepada;x++){
						if(window.localStorage["npp"].toLowerCase()==kepada[x].toLowerCase()){
							var persen = '<input type="text" style="width:50px; height:40px; font-size:20px;" id="persen" value="'+n["persen"]+'"> %<br><br>\
							<a onclick="updatePersen('+n["id_notes"]+')" class="btn btn-primary">Update</a>';
							
						} else {
							var persen = n["persen"]+'%';
						}
					}
				}
				
				if(n['wilayah']=="KP"){
					var kantor = '<b>Kantor Pusat</b> - Divisi <b>'+n['nama_divisi']+'</b>';
				} else {
					var kantor = 'Wilayah <b>'+n['wilayah']+'</b> - Cabang <b>'+n['nama_divisi']+'</b>';
				}
				
				view = view + '<div style="float:right">'+n["tanggal"]+'</div>\
				<table class="table">\
					<tr>\
						<td>Kantor</td>\
						<td>:</td>\
						<td>'+kantor+'</td>\
					</tr>\
					<tr>\
						<td>From</td>\
						<td>:</td>\
						<td><b>'+n["dari"]+'</b></td>\
					</tr>\
					<tr>\
						<td>To</td>\
						<td>:</td>\
						<td>'+n["kepada"]+'</td>\
					</tr>\
					<tr>\
						<td>CC</td>\
						<td>:</td>\
						<td>'+n["cc"]+'</td>\
					</tr>\
					<tr>\
						<td>Progress</td>\
						<td>:</td>\
						<td>'+persen+'</td>\
					</tr>\
					<tr>\
						<td>Status</td>\
						<td>:</td>\
						<td>'+status+'</td>\
					</tr>\
					<tr>\
						<td>Perihal</td>\
						<td>:</td>\
						<td><b><u>'+n["perihal"]+'</u></b></td>\
					</tr>\
				</table>\
				<hr>\
						<pre style="font-size:14px">'+n["detail"]+'</pre>\
						';
				
				//EDIT NOTES - OWNER
				
				if(n['NPPdari']==window.localStorage['npp'] || window.localStorage["priviledge"]=="admin"){
					
					view = view + '<center><a class="btn btn-primary" onclick="gotoEditNotes('+n['id_notes']+',\''+n['wilayah']+'\',\''+n['nama_divisi']+'\')">Edit Notes</a></center><br>';
				} else {
					
					for(var x=0;x<jmlKepada;x++){
						if(window.localStorage["npp"].toLowerCase()==kepada[x].toLowerCase()){
							view = view + '<center><a class="btn btn-primary" onclick="gotoEditNotes('+n['id_notes']+',\''+n['wilayah']+'\',\''+n['nama_divisi']+'\')">Edit Notes</a></center><br>';
						}
					}
				}
				
				//VIEW TAMBAH KOMENTAR
				var kepada = n["nppKepada"].split(",");
				var cc = n["nppCC"].split(",");
				var jmlKepada = kepada.length;
				var jmlCC = cc.length;
				
				//alert(jmlKepada);
				for(var x=0;x<jmlKepada;x++){
					if(window.localStorage["npp"].toLowerCase()==kepada[x].toLowerCase() || window.localStorage["priviledge"]=="admin"){
						var tambahKomentar = '<hr><h4>Tambah Komentar</h4>\
						<table width="100%" class="table">\
							<tr>\
								<td>Komentar</td>\
								<td><textarea type="text" class="form-control" id="komentar"></textarea></td>\
							</tr>\
							<tr>\
								<td></td>\
								<td><button onclick="tambahKomentar('+n["id_notes"]+')" class="btn btn-primary">Kirim</button></td>\
							</tr>\
						</table>';
						$("#viewTambahKomentar").html(tambahKomentar);
					}
				}
				for(var x=0;x<jmlCC;x++){
					if(window.localStorage["npp"].toLowerCase()==cc[x].toLowerCase()){
						var tambahKomentar = '<hr><h4>Tambah Komentar</h4>\
						<table width="100%" class="table">\
							<tr>\
								<td>Komentar</td>\
								<td><textarea type="text" class="form-control" id="komentar"></textarea></td>\
							</tr>\
							<tr>\
								<td></td>\
								<td><button onclick="tambahKomentar('+n["id_notes"]+')" class="btn btn-primary">Kirim</button></td>\
							</tr>\
						</table>';
						$("#viewTambahKomentar").html(tambahKomentar);
					}
				}
				
				if(n['NPPdari']==window.localStorage['npp']){
					var tambahKomentar = '<hr><h4>Tambah Komentar</h4>\
						<table width="100%" class="table">\
							<tr>\
								<td>Komentar</td>\
								<td><textarea type="text" class="form-control" id="komentar"></textarea></td>\
							</tr>\
							<tr>\
								<td></td>\
								<td><button onclick="tambahKomentar('+n["id_notes"]+')" class="btn btn-primary">Kirim</button></td>\
							</tr>\
						</table>';
					$("#viewTambahKomentar").html(tambahKomentar);
				}
				
				viewKomentar(n["id_notes"]);
			});
			
			
			
			$("#view").html(view);
			
			
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
}

function viewKomentar(id_notes){
	//VIEW KOMENTAR
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=getKomentar&id_notes="+id_notes,
		success:function(data){	
			var viewKomentar = "";
			
			viewKomentar = viewKomentar + '<table class="table table-hover table-pesan">';
			$.each(data, function(i,n){
				
				viewKomentar = viewKomentar +'<div class="item">\
					<img src="image/user.png" alt="user image" class="online"/>\
					<p class="message">\
						<a href="#" class="name">\
							<small class="text-muted pull-right"><i class="fa fa-clock-o"></i> '+n["tanggal"]+'</small>\
							'+n["nama"]+'\
						</a>\
						'+n["komentar"]+'\
					</p>\
				</div>';
			});
			viewKomentar = viewKomentar + '<div id="wait" style="display:none;width:69px;height:89px;border:1px solid black;position:absolute;top:50%;left:50%;padding:2px;"><img src="image/loading.gif" width="64" height="64" /></div>';
			$("#viewKomentar").html(viewKomentar);
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
}

function tambahKomentar(id_notes){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	$.ajax ({
		type: 'post',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=tambahKomentar&npp="+window.localStorage["npp"]+"&id_notes="+id_notes+"&komentar="+$("#komentar").val(),
		success:function(data){	
			if(data.status!="fail"){
				
				viewKomentar(id_notes);
			} else {
				alert('Gagal mengirim komentar');
			}
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
}

function notes_masuk(){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=getNotesMasuk&npp="+window.localStorage['npp'],
		success:function(data){	
			var view = "";
			
			
			view = view + '<table class="table table-hover table-pesan"><tbody data-link="row" class="rowlink">';
			if(data!=""){
				$.each(data, function(i,n){
				
					if(n["status"]=='C'){
						var status = '<span class="label label-success" style="font-size:14px">Completed</span>';
					} else {
						var status = '<span class="label label-danger" style="font-size:14px">Not Completed</span>';
					}
					
					if(n["baca"]=="N"){
						view = view +'<tr class="alert-success" id="success">\
							<td style="color:black"><a onclick="notes_read('+n["id_notes"]+')"><span class="glyphicon glyphicon-certificate"></span></a></td>\
							<td width="20%" style="color:black">'+n["tanggal"]+'</td>\
							<td style="color:black">To : <b>'+n["kepada"]+'</b></td>\
							<td style="color:black">CC : <b>'+n["cc"]+'</b></td>\
							<td style="color:black">'+n["perihal"]+' ......</td>\
							<td style="color:black">'+status+' </td>\
						</tr>';
					} else {
						view = view +'<tr>\
							<td></td>\
							<td width="20%"><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+n["tanggal"]+'</a></td>\
							<td>To : <b>'+n["kepada"]+'</b></a></td>\
							<td>CC : <b>'+n["cc"]+'</b></a></td>\
							<td>'+n["perihal"]+' ......</a></td>\
							<td>'+status+'</a></td>\
						</tr>';
					}
					
					
				});
			} else {
			view = view + "<tr ><td class='alert alert-warning' colspan='3'>Tidak ada data</td></tr>";
			}
			
			view = view + "</tbody></table>";
			
			$("#view").html(view);
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
	
}

function notes_read(id_notes){
	$.ajax ({
		type: 'post',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=notes_read&id_notes="+id_notes+"&npp="+window.localStorage['npp'],
		success:function(data){	
			$("#success").className = "";
			gotoDetailNotes(id_notes);
		},
		error: function(data){
			alert('Terjadi kesalahan');
		}	
	});
	
}

function timeline(){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=getTimeline&npp="+window.localStorage['npp'],
		success:function(data){	
			var view = "";
			
			
			view = view + '<table class="table table-hover table-pesan"><tbody data-link="row" class="rowlink">';
			if(data!=""){
				$.each(data, function(i,n){
				
					
					if(n["baca"]=="N"){
						view = view +'<tr class="alert-success" id="success">\
							<td style="color:black"><a onclick="timeline_read('+n["id_notes"]+','+n["id_timeline"]+')"><span class="glyphicon glyphicon-certificate"></span></a></td>\
							<td style="color:black">'+n["timeline"]+'</td>\
							<td width="20%" style="color:black">'+n["tanggal"]+'</td>\
						</tr>';
					} else {
						view = view +'<tr>\
							<td></td>\
							<td><a onclick="timeline_read('+n["id_notes"]+','+n["id_timeline"]+')">'+n["timeline"]+'</td>\
							<td width="20%">'+n["tanggal"]+'</td>\
						</tr>';
					}
					
					
				});
			} else {
			view = view + "<tr ><td class='alert alert-warning' colspan='3'>Tidak ada data</td></tr>";
			}
			
			$("#view").html(view);
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
	
}

function timeline_read(id_notes,id_timeline){
	$.ajax ({
		type: 'post',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=timeline_read&id_timeline="+id_timeline+"&npp="+window.localStorage['npp'],
		success:function(data){	
			$("#success").className = "";
			gotoDetailNotes(id_notes);
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
	
}

function pesan_baru(){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	
	if(window.localStorage["wilayah"]=="KP"){
		$("#getWilayah").html("<b>Kantor Pusat</b> - Divisi <b>"+window.localStorage["nama_divisi"]+"</b>");
	} else {
		$("#getWilayah").html("Wilayah <b>"+window.localStorage["wilayah"]+"</b> - Cabang <b>"+window.localStorage["nama_divisi"]+"</b>");
	}
		
	
	$("#viewButtonKirim").html('<button onclick="notes_kirim('+window.localStorage["kdwil"]+','+window.localStorage["id_divisi"]+')" type="submit" class="btn btn-primary">Simpan</button>');
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=getTo&kdwil="+window.localStorage["kdwil"]+"&nama_divisi="+window.localStorage['nama_divisi'],
		success:function(data){	
			//var viewKepada = '<select class="form-control chosen-select" data-placeholder=" -- Pilih Nama -- " multiple style="font-size:18px"> ';
			//var viewCC = '<select class="form-control chosen-select" data-placeholder=" -- Pilih Nama -- " multiple style="font-size:18px"> ';
			var viewKepada = "";
			var viewCC = "";
			
			
			$.each(data, function(i,n){
				viewKepada = viewKepada + "<option value='"+n['npp']+"'>"+n['nama']+"</option>";
				viewCC = viewCC + "<option value='"+n['npp']+"'>"+n['nama']+"</option>";
			});
			
			//var viewKepada = viewKepada + '</select>';
			//var viewCC = viewCC + '</select>';
			
			$('#viewKepada').html(viewKepada);
			$('#viewCC').html(viewCC);
			/* console.log($('#viewKepada').find('option[value="' + nip + '"]').attr('selected', 'selected').trigger('liszt:updated')); */
			$('#viewKepada').trigger('liszt:updated');
			$('#viewCC').trigger('liszt:updated');
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
}

function notes_kirim(kdwil,id_divisi){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	$.ajax ({
		type: 'post',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=notes_kirim&kdwil="+kdwil+"&id_divisi="+id_divisi+"&viewKepada="+$('#viewKepada').val()+"&viewCC="+$('#viewCC').val()+"&perihal="+$('#perihal').val()+"&detail="+$('#detail').val()+"&dari="+window.localStorage["npp"],
		success:function(data){	
			if(data.status!='fail'){
				
				alert('Notes berhasil dibuat');
				gotoNotes(window.localStorage["id_divisi"],window.localStorage["nama_divisi"]);
			} else {
				alert('Notes gagal dibuat');
			}
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
}

function updatePersen(id_notes){
	if(isInt($('#persen').val()) && $('#persen').val()>=0 && $('#persen').val()<=100){
		$(document).ajaxStart(function(){
			$("#wait").css("display", "block");
		});
		$(document).ajaxComplete(function(){
			$("#wait").css("display", "none");
		});
		$.ajax ({
			type: 'post',
			url: link.url+"server.php",
			dataType: "json",
			data : "request=update_persen&persen="+$('#persen').val()+"&id_notes="+id_notes+"&npp="+window.localStorage["npp"],
			success:function(data){	
				if(data.status!='fail'){
					
					alert('Berhasil update Progress');
					gotoDetailNotes(id_notes);
				} else {
					alert('Gagal update Progress');
				}
			},
			error: function(data){
				////alert('Terjadi kesalahan');
			}	
		});
	} else {
		alert('Progress yang dimasukkan salah!');
	}
}

function ubah_password(){
	if($('#password_baru').val()!=$('#password_konfirmasi').val()){
		alert('Konfirmasi password salah');
	} else {
		$.ajax ({
			type: 'post',
			url: link.url+"server.php",
			dataType: "json",
			data : "request=ubah_password&password_baru="+$('#password_baru').val()+"&password_lama="+$('#password_lama').val()+"&npp="+window.localStorage["npp"],
			success:function(data){	
				if(data.status!='fail'){
					
					alert('Berhasil ubah password');
					window.location = "password.html";
				} else {
					alert(data.message);
					
				}
			},
			error: function(data){
				////alert('Terjadi kesalahan');
			}	
		});
	}
}

function mynotes(){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=mynotes&npp="+window.localStorage['npp'],
		success:function(data){	
			var view = "";
			
			
			view = view + '<table class="table table-hover table-pesan"><tbody data-link="row" class="rowlink">';
			if(data!=""){
				$.each(data, function(i,n){
				
					if(n["status"]=='C'){
						var status = '<span class="label label-success" style="font-size:14px">Completed</span>';
					} else {
						var status = '<span class="label label-danger" style="font-size:14px">Not Completed</span>';
					}
					
					
						view = view +'<tr>\
							<td></td>\
							<td width="20%"><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+n["tanggal"]+'</a></td>\
							<td>To : <b>'+n["kepada"]+'</b></a></td>\
							<td>CC : <b>'+n["cc"]+'</b></a></td>\
							<td>'+n["perihal"]+' ......</a></td>\
							<td>'+status+'</a></td>\
						</tr>';
					
					
					
				});
			} else {
			view = view + "<tr ><td class='alert alert-warning' colspan='3'>Tidak ada data</td></tr>";
			}
			
			view = view + "</tbody></table>";
			
			$("#view").html(view);
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
	
}

function edit_notes(){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	
	if(window.localStorage["wilayah"]=="KP"){
		$("#getWilayah").html("<b>Kantor Pusat</b> - Divisi <b>"+window.localStorage["nama_divisi"]+"</b>");
	} else {
		$("#getWilayah").html("Wilayah <b>"+window.localStorage["wilayah"]+"</b> - Cabang <b>"+window.localStorage["nama_divisi"]+"</b>");
	}
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=getNotes&id_notes="+window.localStorage['id_notes'],
		success:function(data){	
			
				
				
					
				
			
			//VIEW
			
			var view = "";
			
			$.each(data, function(i,n){
				
				//kepada
				var kepada = n["nppKepada"].split(",");
				var jmlKepada = kepada.length;
				
				var cc = n["nppCC"].split(",");
				var jmlCC = cc.length;
					
				$.ajax ({
					type: 'get',
					url: link.url+"server.php",
					dataType: "json",
					data : "request=getTo&kdwil="+window.localStorage["kdwil"]+"&nama_divisi="+window.localStorage['nama_divisi'],
					success:function(data){	
						//var viewKepada = '<select class="form-control chosen-select" data-placeholder=" -- Pilih Nama -- " multiple style="font-size:18px"> ';
						//var viewCC = '<select class="form-control chosen-select" data-placeholder=" -- Pilih Nama -- " multiple style="font-size:18px"> ';
						var viewKepada = "";
						var viewCC = "";
						
						
						$.each(data, function(i,m){
							found = $.inArray(m['npp'], kepada);
							if(found==-1){
								viewKepada = viewKepada + "<option value='"+m['npp']+"'>"+m['nama']+"</option>";
							} else {
								viewKepada = viewKepada + "<option selected value='"+m['npp']+"'>"+m['nama']+"</option>";
							}
							
							found = $.inArray(m['npp'], cc);
							if(found==-1){
								viewCC = viewCC + "<option value='"+m['npp']+"'>"+m['nama']+"</option>";
							} else {
								viewCC = viewCC + "<option selected value='"+m['npp']+"'>"+m['nama']+"</option>";
							}
						});
						
						//var viewKepada = viewKepada + '</select>';
						//var viewCC = viewCC + '</select>';
						
						$('#viewKepada').html(viewKepada);
						$('#viewCC').html(viewCC);
						/* console.log($('#viewKepada').find('option[value="' + nip + '"]').attr('selected', 'selected').trigger('liszt:updated')); */
						$('#viewKepada').trigger('liszt:updated');
						$('#viewCC').trigger('liszt:updated');
					},
					error: function(data){
						////alert('Terjadi kesalahan');
					}	
				});
				
				view = view + '<div class="form-group">\
				<label for="exampleInputEmail1">To</label>\
				<!-- <input id="tags" class="form-control"> -->\
				<select id="viewKepada" class="form-control chosen-select" data-placeholder=" -- Pilih Nama -- " multiple style="font-size:18px"> \
					\
					\
					\
				</select>\
			  </div>\
			  <div class="form-group">\
				<label for="exampleInputEmail1">CC</label>\
				<select id="viewCC" class="form-control chosen-select" data-placeholder=" -- Pilih Nama -- " multiple style="font-size:18px"> \
					\
					\
					\
				</select>\
				</div>\
				\
				\
				<div class="form-group">\
				<label for="exampleInputPassword1">Perihal</label>\
				<textarea id="perihal" class="form-control text-area" TextMode="MultiLine" onkeyup="setHeight(\'text-area\');" onkeydown="setHeight(\'text-area\');">'+n['perihal']+'</textarea>\
			  </div>\
				\
			  <div class="form-group">\
				<label for="exampleInputPassword1">Detail Notes</label>\
				<textarea id="detail" class="form-control text-area" TextMode="MultiLine" onkeyup="setHeight(\'text-area\');" onkeydown="setHeight(\'text-area\');">'+n['detail']+'</textarea>\
			  </div>';
				 
				 $("#viewButtonKirim").html('<button onclick="notes_edit('+n['id_notes']+')" type="submit" class="btn btn-primary">Simpan</button>');
				 
			});
			
			
			
			$("#view").html(view);
			
			setHeight('text-area');
			
			
			
			
			
			var config = {
			  '.chosen-select'           : {},
			  '.chosen-select-deselect'  : {allow_single_deselect:true},
			  '.chosen-select-no-single' : {disable_search_threshold:10},
			  '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
			  '.chosen-select-width'     : {width:"100%"}
			}
			for (var selector in config) {
			  $(selector).chosen(config[selector]);
			}
			
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
}

function notes_edit(id_notes){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	$.ajax ({
		type: 'post',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=notes_edit&id_notes="+id_notes+"&viewKepada="+$('#viewKepada').val()+"&viewCC="+$('#viewCC').val()+"&perihal="+$('#perihal').val()+"&detail="+$('#detail').val(),
		success:function(data){	
			if(data.status!='fail'){
				
				alert('Perubahan Notes berhasil disimpan');
				gotoDetailNotes(id_notes);
			} else {
				alert('Gagal menyimpan perubahan');
			}
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
}

function search(){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	
	
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=getNotes&id_divisi="+window.localStorage['id_divisi']+"&search="+$('#search').val()+'&id_notes',
		success:function(data){	
			var view = "";
			
			
			view = view + '<table class="table table-hover table-pesan"><tbody data-link="row" class="rowlink">';
			if(data!=""){
				$.each(data, function(i,n){
					
					if(n["status"]=='C'){
						var status = '<span class="label label-success" style="font-size:14px">Completed</span>';
					} else {
						var status = '<span class="label label-danger" style="font-size:14px">Not Completed</span>';
					}
					
					
					view = view +'<tr>\
						<td><a onclick="gotoDetailNotes('+n["id_notes"]+')">To : <b>'+n["kepada"]+'</b></a></td>\
						<td><a onclick="gotoDetailNotes('+n["id_notes"]+')">CC : <b>'+n["cc"]+'</b></a></td>\
						<td><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+n["perihal"]+' ......</a></td>\
						<td width="20%"><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+n["tanggal"]+'</a></td>\
						<td><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+n["persen"]+'% </a></td>\
						<td><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+status+' </a></td>\
					</tr>';
				});
			} else {
			view = view + "<tr ><td class='alert alert-warning' colspan='6'>Tidak ada Notes</td></tr>";
			}
			
			view = view + "</tbody></table>";
			
			$("#view").html(view);
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});

}

function search_mynotes(){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=mynotes&npp="+window.localStorage['npp']+"&search="+$('#search').val(),
		success:function(data){	
			var view = "";
			
			
			view = view + '<table class="table table-hover table-pesan"><tbody data-link="row" class="rowlink">';
			if(data!=""){
				$.each(data, function(i,n){
				
					if(n["status"]=='C'){
						var status = '<span class="label label-success" style="font-size:14px">Completed</span>';
					} else {
						var status = '<span class="label label-danger" style="font-size:14px">Not Completed</span>';
					}
					
					
						view = view +'<tr>\
							<td></td>\
							<td width="20%"><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+n["tanggal"]+'</a></td>\
							<td>To : <b>'+n["kepada"]+'</b></a></td>\
							<td>CC : <b>'+n["cc"]+'</b></a></td>\
							<td>'+n["perihal"]+' ......</a></td>\
							<td>'+status+'</a></td>\
						</tr>';
					
					
					
				});
			} else {
			view = view + "<tr ><td class='alert alert-warning' colspan='3'>Tidak ada data</td></tr>";
			}
			
			view = view + "</tbody></table>";
			
			$("#view").html(view);
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
	
}

function search_notes_masuk(){
	$(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
	$.ajax ({
		type: 'get',
		url: link.url+"server.php",
		dataType: "json",
		data : "request=getNotesMasuk&npp="+window.localStorage['npp']+"&search="+$('#search').val(),
		success:function(data){	
			var view = "";
			
			
			view = view + '<table class="table table-hover table-pesan"><tbody data-link="row" class="rowlink">';
			if(data!=""){
				$.each(data, function(i,n){
				
					if(n["status"]=='C'){
						var status = '<span class="label label-success" style="font-size:14px">Completed</span>';
					} else {
						var status = '<span class="label label-danger" style="font-size:14px">Not Completed</span>';
					}
					
					if(n["baca"]=="N"){
						view = view +'<tr class="alert-success" id="success">\
							<td style="color:black"><a onclick="notes_read('+n["id_notes"]+')"><span class="glyphicon glyphicon-certificate"></span></a></td>\
							<td width="20%" style="color:black">'+n["tanggal"]+'</td>\
							<td style="color:black">To : <b>'+n["kepada"]+'</b></td>\
							<td style="color:black">CC : <b>'+n["cc"]+'</b></td>\
							<td style="color:black">'+n["perihal"]+' ......</td>\
							<td style="color:black">'+status+' </td>\
						</tr>';
					} else {
						view = view +'<tr>\
							<td></td>\
							<td width="20%"><a onclick="gotoDetailNotes('+n["id_notes"]+')">'+n["tanggal"]+'</a></td>\
							<td>To : <b>'+n["kepada"]+'</b></a></td>\
							<td>CC : <b>'+n["cc"]+'</b></a></td>\
							<td>'+n["perihal"]+' ......</a></td>\
							<td>'+status+'</a></td>\
						</tr>';
					}
					
					
				});
			} else {
			view = view + "<tr ><td class='alert alert-warning' colspan='3'>Tidak ada data</td></tr>";
			}
			
			view = view + "</tbody></table>";
			
			$("#view").html(view);
		},
		error: function(data){
			////alert('Terjadi kesalahan');
		}	
	});
	
}


//ALL FUNCTION


//DIRECT FUNCTION
function gotoDivisi(x,y){
	window.localStorage["kdwil"] = x;
	window.localStorage["wilayah"] = y;
	window.location = "divisi.html";
}

function gotoNotes(x,y){
	window.localStorage["id_divisi"] = x;
	window.localStorage["nama_divisi"] = y;
	window.location = "notes.html";
}

function gotoDetailNotes(x){
	window.localStorage["id_notes"] = x;
	window.location = "notes_detail.html";
}
function gotoEditNotes(x,y,z){
	window.localStorage["id_notes"] = x;
	window.localStorage["wilayah"] = y;
	window.localStorage["nama_divisi"] = z;
	window.location = "edit_notes.html";
}


//DIRECT FUNCTION

//Other Function
function setHeight(fieldId){
	document.getElementsByClassName(fieldId)[0].style.height = document.getElementsByClassName(fieldId)[0].scrollHeight+'px';
	document.getElementsByClassName(fieldId)[1].style.height = document.getElementsByClassName(fieldId)[1].scrollHeight+'px';
}
function isInt(n) {
   return n % 1 === 0;
}
//Other Function
	