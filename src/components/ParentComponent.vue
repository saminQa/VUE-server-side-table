<template>
  <div>
    <ReusableCrudTable
      titulka="Parent table"
      titulka-icon="book"
      :headers="headers"
      :initial-columns="[
        'year',
        'int_number',
        'status',
        'date',
        'addressee',
        'content',
        'type',
        'employee%id',
      ]"
      :column-filters="[
        {
          column: 'status',
          type: 'select',
          queryParam: 'search_status',
          items: status_posty,
          title: 'nazov',
          value: 'id',
          placeholder: 'Sent / Received',
        },
        {
          column: 'addressee',
          type: 'text',
          queryParam: 'search_adresat',
          placeholder: 'Addressee',
        },
      ]"
      :fetch-items="fetchItems"
      :create-item="createItem"
      :update-item="updateItem"
      :delete-item="deleteItem"
      @update:search="onSearchUpdate"
      ref="parentCrudTable"
    >
      <template #form="{ editedItem, updateEditedItem, isReadOnly }">
        <KnihaPostyForm
          :edit-form-data="editedItem"
          :update-edited-item="updateEditedItem"
          :is-read-only="isReadOnly"
          ref="formComponent"
        />
      </template>

      <template v-slot:item.status="{ item }">
        {{ statusPostyTabulka(item) }}
      </template>
      <template v-slot:item.employee_id="{ item }">
        {{ showEmployeeInTable(item) }}
      </template>
      <template v-slot:item.date="{ item }">
        {{ formatDate(item.date) }}
      </template>
    </ReusableCrudTable>
  </div>
</template>

<script>
import ReusableCrudTable from './UI/ReusableCrudTable.vue';
import axios from 'axios';
import KnihaPostyForm from './forms/ChildForm.vue';

export default {
  components: {
    ReusableCrudTable,
    KnihaPostyForm,
  },
  data() {
    return {
      headers: [
        { title: 'Akcie', key: 'actions', sortable: false, width: '8%' },
        // { title: 'exp', key: 'data-table-expand' },
        { title: 'ID', key: 'id', sortable: false, width: '7%' },
        {
          title: 'Year',
          key: 'year',
          sortable: false,
          width: '8%',
        },
        {
          title: 'Internal nr.',
          key: 'int_number',
          sortable: false,
          width: '10%',
        },

        {
          title: 'Sent / Received',
          key: 'status',
          sortable: false,
          width: '10%',
        },
        {
          title: 'Date',
          key: 'date',
          sortable: false,
          width: '10%',
        },
        { title: 'Addressee', key: 'addressee', sortable: false, width: '15%' },
        {
          title: 'Content',
          key: 'content',
          sortable: false,
          width: '15%',
        },
        {
          title: 'Shipment type',
          key: 'type',
          sortable: false,
          width: '10%',
        },
        {
          title: 'Employee',
          key: 'employee_id',
          sortable: false,
          width: '10%',
        },
      ],
      apiLink: '../../data.json',
      selectedItem: null,
      itemsPerPage: 50,
      page: 1,
      big_search: '',
      filters: {},
      default_filters: {},
      status_posty: [
        { nazov: 'Sent', id: 1 },
        { nazov: 'Received', id: 2 },
      ],
      editedItem: { int_cislo: 78 },
      selectUsers: [
        { title: 'adriana.babalova', value: 1 },
        { title: 'twix.babal', value: 2 },
        { title: 'enzo', value: 3 },
      ],
    };
  },
  methods: {
    async fetchItems({
      page,
      itemsPerPage,
      big_search,
      sortBy,
      sortDesc,
      ...filters
    }) {
      try {
        const response = await axios.get(this.apiLink, {
          params: {
            page: page,
            take: itemsPerPage,
            big_search: big_search,

            // sortBy: sortBy.length > 0 ? sortBy[0] : null,
            //sortDesc: sortDesc.length > 0 ? sortDesc[0] : null,
            ...filters,
          },
          withCredentials: true,
        });
        const [items, total] = response.data;

        // return {
        //     items: items, // the first element (array of items)
        //     total: total, // the second element (number)
        //   };
        // } catch (error) {
        //   console.error('Error fetching items:', error);
        //   return { items: [], total: 0 };

        // ---------  or add your logic here to get the filtered items

        if (big_search) {
          const filteredItems = items.filter(
            (item) =>
              item.addressee
                .toLowerCase()
                .startsWith(big_search.toLowerCase()) ||
              item.type.toLowerCase().startsWith(big_search.toLowerCase()) ||
              item.content.toLowerCase().startsWith(big_search.toLowerCase())
          );
          return {
            items: filteredItems,
            total: Object.keys(filteredItems).length,
          };
        }

        if (JSON.stringify(filters) !== '{}') {
          if (filters.search_adresat && filters.search_status) {
            const filteredItems = items.filter(
              (item) =>
                item.addressee
                  .toLowerCase()
                  .startsWith(filters.search_adresat.toLowerCase()) &&
                item.status == Number(filters.search_status.join(''))
            );
            return {
              items: filteredItems,
              total: Object.keys(filteredItems).length,
            };
          } else if (filters.search_adresat === '') {
            const response = await axios.get(this.apiLink, {
              params: {
                page: page,
                take: itemsPerPage,
                big_search: big_search,
                ...filters,
              },
              withCredentials: true,
            });
            const [items, total] = response.data;
            return {
              items: items,
              // total: total, -- total number of items from server
              total: Object.keys(items).length,
            };
          } else if (filters.search_adresat) {
            const filteredItems = items.filter(
              (item) =>
                item.addressee
                  .toLowerCase()
                  .startsWith(filters.search_adresat.toLowerCase())
              // item.status == Number(filters.search_status.join(''))
            );
            return {
              items: filteredItems,
              total: Object.keys(filteredItems).length,
            };
          } else if (filters.search_status) {
            const filteredItems = items.filter(
              (item) => item.status == Number(filters.search_status.join(''))
            );
            return {
              items: filteredItems,
              total: Object.keys(filteredItems).length,
            };
          }
        } else {
          return {
            items: items,
            total: Object.keys(items).length,
          };
        }
      } catch (error) {
        console.error('Error when fetching items:', error);

        return { items: [], total: 0 };
      }
    },
    onSearchUpdate(newSearch) {
      this.big_search = newSearch;
    },
    async validateForm() {
      const formComponent = this.$refs.formComponent;
      if (formComponent && typeof formComponent.validate === 'function') {
        return await formComponent.validate();
      }
      return false;
    },
    async createItem(item) {
      item.year
        ? (item.year = item.year)
        : (item.year = new Date().getFullYear());
      // const response = await axios.post(`${this.apiLink}`, item, {
      //   withCredentials: true,
      // });

      // return response.data;
      alert('Item created: ' + JSON.stringify(item));
    },

    async updateItem(item) {
      // const response = await axios.patch(`${this.apiLink}/${item.id}`, item, {
      //   withCredentials: true,
      // });
      // return response.data;
      alert('Item updated: ' + JSON.stringify(item));
    },

    async deleteItem(item) {
      // const response = await axios.delete(`${this.apiLink}/${item.id}`, {
      //   withCredentials: true,
      // });
      // return response.data;

      alert('Item deleted: ' + JSON.stringify(item));
    },

    statusPostyTabulka(item) {
      const status = this.status_posty.find((x) => x.id === item.status);

      if (status) {
        return status.nazov;
      } else {
        return null;
      }
    },
    showEmployeeInTable(item) {
      const empl = this.selectUsers.find((x) => x.value === item.employee_id);
      if (empl) {
        return empl.title;
      } else {
        return null;
      }
    },
    formatDate(date) {
      const datum = new Date(date).toLocaleDateString('sk-SK');

      if (!date) {
        return null;
      } else {
        return datum;
      }
    },
  },
};
</script>

<style>
/* .table-background {
  background-color: var(--background);
} */
</style>
