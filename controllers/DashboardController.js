module.exports = {
  async Dashboard (request, response) {
    let sessionUser = request.session.user
    response.render('pages/dashboard/index', { sessionUser })
  },

}
