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
    let filter =
      req.query && req.query.filter ? JSON.parse(req.query.filter) : {};
    let where = {};

    let limit = limitFilter(req);
    let skip = skipFilter(req, limit);
    let sort = sortFilter(filter);
    if (filter && filter.where) {
      where = filter.where;
    }

    if (search && search != '') {
      where['$or'] = [
        { firstName: { $regex: search } },
        { lastName: { $regex: search } }
      ];
    }

    const getAllResult = await User.find(where, { password: 0, role: 0 })
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
    let getSingleResult = await User.findById(userId, { password: 0, role: 0 });
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
  let limit = 0;
  if (req.query && req.query.limit && parseInt(req.query.limit, 10) > 0) {
    limit = parseInt(req.query.limit, 10);
  }
  if (limit > 10) {
    limit = constant.pageLimit;
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

function sortFilter(filter) {
  let sort = {};
  if (filter && filter.sort) {
    sort = filter.sort;
  }
  return sort;
}

module.exports = {
  getAll,
  getById
};
