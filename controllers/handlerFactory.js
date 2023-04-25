const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (Model, template, title) =>
  catchAsync(async (req, res, next) => {
    let doc;
    if (req.params.slug) {
      doc = await Model.findOneAndDelete({ slug: req.params.slug });
    }
    if (req.params.id) {
      doc = await Model.findByIdAndDelete(req.params.id);
    }
    if (!doc) {
      return next(new AppError('No document found with that Id', 404));
    }
    const results = await Model.find();
    if (template) {
      // Render the specified template and pass the data
      res.status(200).render(template, {
        title: title,
        datas: results,
      });
    } else {
      // Send the JSON response
      res.status(200).json({
        status: 'success',
        results: null,
      });
    }
  });

exports.updateOne = (Model, template, title) =>
  catchAsync(async (req, res, next) => {
    let doc;
    if (req.params.slug) {
      doc = await Model.findOneAndUpdate({ slug: req.params.slug }, req.body, {
        new: true,
        runValidators: true,
      });
    } else if (req.params.id) {
      doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    const results = await Model.find();
    if (template) {
      // Render the specified template and pass the data
      res.status(200).render(template, {
        title: title,
        datas: results,
      });
    } else {
      // Send the JSON response
      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc,
        },
      });
    }
  });

exports.createOne = (Model, template, title) =>
  catchAsync(async (req, res, next) => {
    await Model.create(req.body);
    const doc = await Model.find();

    if (template) {
      // Render the specified template and pass the data
      res.status(200).render(template, {
        title: title,
        datas: doc,
      });
    } else {
      // Send the JSON response
      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc,
        },
      });
    }
  });

exports.getOne = (Model, popOptions, template, title) =>
  catchAsync(async (req, res, next) => {
    let query;
    if (req.params.slug) {
      query = Model.findOne({ slug: req.params.slug });
    } else if (req.params.id) {
      query = Model.findById(req.params.id);
    }
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }
    console.log(doc);
    if (template) {
      // Render the specified template and pass the data
      res.status(200).render(template, {
        title: title,
        doc,
      });
    } else {
      // Send the JSON response
      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc,
        },
      });
    }
  });

exports.getAll = (Model, template, title) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.movieId) filter = { movie_id: req.params.movieId };
    console.log(req.query);

    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .limiter()
      .limiter()
      .pager();
    const doc = await features.query;

    if (template) {
      // Render the specified template and pass the data
      res.status(200).render(template, {
        title: title,
        datas: doc,
      });
    } else {
      // Send the JSON response
      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc,
        },
      });
    }
  });
