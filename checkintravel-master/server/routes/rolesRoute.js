const express = require('express');
const router = express.Router();
const passport = require('passport')
const roles = require('../model/role');
const Role = require('../model/role');
const {
  Response,
  responseBuilder,
  errorResponse, toDate
} = require('./common');
const logger = require('../lib/logger')
const HttpStatus = require('http-status-codes');

// Get users
router.get('/', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {

  try {
    let rolesList = await roles.find()

    res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, rolesList, 'GET request for roles'));
  } catch (err) {
    logger.error('Error getting roles');

    res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse('Error getting roles ' + (typeof err == 'object' ? err.message : err)));
  }
});

router.get('/:roleId', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  
  const id = req.params.roleId;
  logger.debug('GET request for role ' + id);

  if (id) {
    Role.findById(id).then(
      (role) => {        
        res.status(HttpStatus.OK).json(responseBuilder(true,HttpStatus.OK,role, 'Role ' + id + ' found'));
      },
      (err) => {
        
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error GET request for role "+typeof err == 'object' ? err.message : err));
      })
  } else {
    
    res.status(HttpStatus.NO_CONTENT).json(errorResponse("GET request with no data",HttpStatus.NO_CONTENT));
  }
})

router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  
  let role = req.body;

  logger.debug('role route post : received role - ' + JSON.stringify(role))

  if (role) {
    // TODO: need to hadle password encryption
    let newRole = new Role({
      name: role.name,
      role: role.role
    });

    roles.getRoleByName(role.name, async (err, foundRole) => {

      if (err) {        
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error inserting role "+typeof err == 'object' ? err.message : err));
      } else if (foundRole) {        
        res.status(HttpStatus.METHOD_NOT_ALLOWED).json(responseBuilder(false,HttpStatus.METHOD_NOT_ALLOWED,foundRole, "role " + role.name + " already exists"));
      } else {
        try {
          const result = await newRole.save();

          logger.debug("result " + JSON.stringify(result))

          
          res.status(HttpStatus.OK).json(responseBuilder(true,HttpStatus.OK,result, 'Role insert OK'));
        } catch (err) {
          
          res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error inserting role "+typeof err == 'object' ? err.message : err));
        }
      }
    })
  } else {
    
    res.status(HttpStatus.NO_CONTENT).json(errorResponse("POST request with no data",HttpStatus.NO_CONTENT));
  }
})


module.exports = router;
