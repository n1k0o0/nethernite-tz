import axios from 'axios'

const state = () => ({
  packages: [],
  versions: [],
  packageDetails: [],
  error: '',
  loading: false,
})
const getters = {
  packages (state) { return state.packages },
  error (state) { return state.error },
  loading (state) { return state.loading },
  versions (state) { return state.versions },
  packageDetails (state) { return state.packageDetails },
}
const mutations = {
  SET_PACKAGES (state, payload) {
    state.packages = payload
  },
  SET_ERROR (state, payload) {
    state.error = payload
  },
  SET_LOADING (state, payload) {
    state.loading = payload
  },
  SET_VERSIONS (state, payload) {
    state.versions = payload
  },
  SET_PACKAGE_DETAILS (state, payload) {
    state.packageDetails = payload
  },
}
const actions = {
  async GET_PACKAGES ({ commit }, value) {
    commit('SET_LOADING', true)
    axios.defaults.baseURL = process.env.VUE_APP_NPMS
    await axios.get(`search?size=100&q=${value}`)
      .then(data => {
        let pack = data.data.results.map((item) => item['package'])
        commit('SET_PACKAGES', pack || [])
        commit('SET_ERROR', null)
      })
      .catch(e => {
        commit('SET_ERROR', e.response.data.message || [])
        commit('SET_PACKAGES', [])
      })
      .finally(() => commit('SET_LOADING', false))

  },
  async GET_VERSIONS ({ commit }, value) {
    commit('SET_LOADING', true)
    commit('SET_VERSIONS', [])
    axios.defaults.baseURL = process.env.VUE_APP_JSDELIVR
    await axios.get(`package/npm/${value}`)
      .then(data => {
        let versions = data.data.versions.map((item) => ({ version: item }))
        commit('SET_VERSIONS', versions || [])
        commit('SET_ERROR', null)
      })
      .catch(e => {
        commit('SET_ERROR', e.response.data.message || [])
        commit('SET_VERSIONS', [])
      })
      .finally(() => commit('SET_LOADING', false))
  },
  async GET_PACKAGE_DETAILS ({ commit }, value) {
    commit('SET_LOADING', true)
    commit('SET_PACKAGE_DETAILS', [])
    axios.defaults.baseURL = process.env.VUE_APP_JSDELIVR
    await axios.get(`package/npm/${value}`)
      .then(data => {
        let files = []
        let packageDetails = data.data.files

        function check (packageDetails) {
          for (let k of packageDetails) {
            if (k.files) {
              check(k.files)
            } else {
              files.push(k)
            }
          }
        }

        check(packageDetails)

        commit('SET_PACKAGE_DETAILS', files || [])
        commit('SET_ERROR', null)
      })
      .catch(e => {
        commit('SET_ERROR', e.response?.data?.message || [])
        commit('SET_PACKAGE_DETAILS', [])
      })
      .finally(() => commit('SET_LOADING', false))
  },
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
