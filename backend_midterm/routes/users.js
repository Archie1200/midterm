var express = require('express')
var application = express()
var ObjectId = require('mongodb').ObjectId


// show and add user form
application.get('/add', function(req, res, next){	
	res.render('user/add', {
		title: 'Add New User',
		name: '',
		description: '',
		Markdown: ''		
	})
})
//show users list
application.get('/', function(req, res, next) {	
	req.db.collection('users').find().sort({"_id": -1}).toArray(function(err, result) {
		if (err) {
			req.flash('error', err)
			res.render('user/list', {
				title: 'User List', 
				data: ''
			})
		} else {
			res.render('user/list', {
				title: 'User List', 
				data: result
			})
		}
	})
})


// addition 
application.post('/add', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           
	req.assert('description', 'description is required').notEmpty()             
    req.assert('Markdown', 'A valid Markdown is required').isMarkdown()  

    var a = req.validationErrors()
    
    if( !a ) {
		var user = {
			name: req.sanitize('name').escape().trim(),
			description: req.sanitize('description').escape().trim(),
			Markdown: req.sanitize('Markdown').escape().trim()
		}
				 
		req.db.collection('users').insert(user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				res.render('user/add', {
					title: 'Add New User',
					name: user.name,
					description: user.description,
					Markdown: user.Markdown					
				})
			} else {				
				req.flash('success', 'Data added successfully!')				
				res.redirect('/users')
			}
		})		
	}
	else { 
		var message = ''
		a.forEach(function(error) {
			message += error.msg + '<br>'
		})				
		req.flash('error', message)		
        res.render('user/add', { 
            title: 'Add New User',
            name: req.body.name,
            description: req.body.description,
            Markdown: req.body.Markdown
        })
    }
})

// editing the values
application.get('/edit/(:id)', function(req, res, next){
	var x = new ObjectId(req.params.id)
	req.db.collection('users').find({"_id": x}).toArray(function(err, result) {
		if(err) return console.log(err)
		
		if (!result) {
			req.flash('error', 'User not found with id = ' + req.params.id)
			res.redirect('/users')
		}
		else {
			res.render('user/edit', {
				title: 'Edit User', 
				id: result[0]._id,
				name: result[0].name,
				description: result[0].description,
				Markdown: result[0].Markdown					
			})
		}
	})	
})
// deletion
application.delete('/delete/(:id)', function(req, res, next) {	
	var x = new ObjectId(req.params.id)
	req.db.collection('users').remove({"_id": x}, function(err, result) {
		if (err) {
			req.flash('error', err)
			res.redirect('/users')
		} else {
			req.flash('success', 'User data deleted successfully! id = ' + req.params.id)
			
			res.redirect('/users')
		}
	})	
})

module.exports = application


// posting 
application.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is mandatory').notEmpty()          
	req.assert('description', 'description is mandatory').notEmpty()             
    req.assert('Markdown', 'A Markdown is required').isMarkdown()  

    var a = req.validationErrors()
    
    if( !a ) {
		var user = {
			name: req.sanitize('name').escape().trim(),
			description: req.sanitize('description').escape().trim(),
			Markdown: req.sanitize('Markdown').escape().trim()
		}
		
		var x = new ObjectId(req.params.id)
		req.db.collection('users').update({"_id": x}, user, function(err, result) {
			if (err) {
				req.flash('error', err)
				res.render('user/edit', {
					title: 'Edit User',
					id: req.params.id,
					name: req.body.name,
					description: req.body.description,
					Markdown: req.body.Markdown
				})
			} else {
				req.flash('success', 'Data updated successfully!')
				
				res.redirect('/users')
			}
		})		
	}
	else {
		var message = ''
		a.forEach(function(error) {
			message += error.msg + '<br>'
		})
		req.flash('error', message)
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			name: req.body.name,
			description: req.body.description,
			Markdown: req.body.Markdown
        })
    }
})

