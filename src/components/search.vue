<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h2>Search Package</h2>
        <p>Search package,expand and see versions,click version and see details of package.</p>
        <v-text-field
            v-model="value"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            @change="search()"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-alert v-if="error" type="error">
          {{ error }}
        </v-alert>
        <v-data-table
            :headers="headers"
            :items="packages"
            item-key="name"
            :items-per-page="10"
            class="elevation-1 my-5"
            show-expand
            :loading="loading"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            @item-expanded="loadVersions"
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <template>
                <v-data-table
                    :headers="headersVersion"
                    :items="versions"
                    :items-per-page="5"
                    class="elevation-1"
                    @click:row="loadVersionPackage"
                >
                </v-data-table>
              </template>
            </td>
          </template>
        </v-data-table>
      </v-col>
      <template>
        <v-row justify="center">
          <v-dialog
              v-model="dialog"
              max-width="80%"
          >
            <v-card>
              <v-card-title class="headline">
                Details
              </v-card-title>

              <v-card-text>
                <v-data-table
                    :headers="headersPackageDetails"
                    :items="packageDetails"
                    :items-per-page="5"
                    class="elevation-1"
                >
                </v-data-table>
              </v-card-text>

            </v-card>
          </v-dialog>
        </v-row>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Search',

  data: () => ({
    name: '',
    value: '',
    expanded: [],
    singleExpand: true,
    dialog: false,
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Description', value: 'description' },
      { text: 'Author', value: 'author.name' },
    ],
    headersVersion: [
      {
        text: 'Versions',
        align: 'start',
        sortable: false,
        value: 'version',
      },
    ],
    headersPackageDetails: [
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      {
        text: 'Hash',
        align: 'start',
        sortable: false,
        value: 'hash',
      },
      {
        text: 'Size',
        align: 'start',
        sortable: false,
        value: 'size',
      },
      {
        text: 'Time',
        align: 'start',
        sortable: false,
        value: 'time',
      },
    ],
  }),
  methods: {
    ...mapActions({
      SET_PACKAGES: 'Package/GET_PACKAGES',
      SET_VERSIONS: 'Package/GET_VERSIONS',
      SET_PACKAGE_DETAILS: 'Package/GET_PACKAGE_DETAILS'
    }),
    search () {
      this.SET_PACKAGES(this.value)
    },
    loadVersions ({ item }) {
      this.name = item.name
      this.SET_VERSIONS(item.name)
    },
    loadVersionPackage (item) {
      let full = this.name + '@' + item.version
      this.SET_PACKAGE_DETAILS(full)
      this.dialog = true
    }
  },
  computed: {
    ...mapGetters({
      packages: 'Package/packages',
      error: 'Package/error',
      loading: 'Package/loading',
      versions: 'Package/versions',
      packageDetails: 'Package/packageDetails',
    })
  },
}
</script>
