const mongoose = require('mongoose');
const constant = require('../../../constants/constant');
const logger = require('../../helpers/logger');
const User = require('../../model/user');

async function getAll(req, res) {
  try {
    if (req.body && req.body.role !== 'admin') {
      return res.status(constant.statusCode.BAD_REQUEST).send({
        error: true,
        message: 'Unauthorized user.'
      });
    }
    let search = req.query && req.query.search ? req.query.search : '';
    let where = {};

    let limit = limitFilter(req);
    let skip = skipFilter(req, limit);
    let sort = sortFilter(req);

    if (search && search != '') {
      where['$or'] = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const getAllResult = await User.find(where, {
      password: 0,
      createdAt: 0,
      updatedAt: 0
    })
      .sort(sort)
      .limit(limit)
      .skip(skip);
    const getTotalCount = await User.find(where).countDocuments();

    return res.status(constant.statusCode.OK).send({
      error: false,
      message: 'success',
      responseData: getAllResult,
      totalRecords: getTotalCount
    });
  } catch (error) {
    logger.error(error);
    return res.status(constant.statusCode.BAD_REQUEST).send({
      error: true,
      message: error.message
    });
  }
}

async function getById(req, res) {
  try {
    if (req.body && req.params && req.body.id !== req.params.id) {
      return res.status(constant.statusCode.BAD_REQUEST).send({
        error: true,
        message: 'Unauthorized user.'
      });
    }
    let userId = mongoose.Types.ObjectId(req.params.id);
    let getSingleResult = await User.findById(userId, {
      id: 0,
      password: 0,
      role: 0,
      createdAt: 0,
      updatedAt: 0
    });
    return res.status(constant.statusCode.OK).send({
      error: false,
      message: 'success',
      responseData: getSingleResult
    });
  } catch (error) {
    logger.error(error);
    return res.status(constant.statusCode.BAD_REQUEST).send({
      error: true,
      message: error.message
    });
  }
}

function limitFilter(req) {
  let limit = constant.pageLimit;
  if (
    req.query &&
    req.query.limit &&
    parseInt(req.query.limit, 10) > 0 &&
    parseInt(req.query.limit, 10) < 10
  ) {
    limit = parseInt(req.query.limit, 10);
  }

  return limit;
}

function skipFilter(req, limit) {
  let skip = 0;
  if (req.query && req.query.page && parseInt(req.query.page, 10) > 0) {
    skip = (parseInt(req.query.page, 10) - 1) * limit;
  }
  return skip;
}

function sortFilter(req) {
  // default sorting set to createdAt desc.
  let sort = {
    createdAt: -1
  };
  try {
    if (req.query && req.query.sort) {
      sort = { ...sort, ...JSON.parse(req.query.sort) };
    }
  } catch (e) {}
  return sort;
}

module.exports = {
  getAll,
  getById
};
