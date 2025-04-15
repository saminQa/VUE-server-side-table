<template>
  <v-form ref="form" @submit.prevent="$emit('on-submit', childForm)">
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" lg="3" md="3" sm="6">
              <v-select
                v-model.number="childForm.status"
                label="Sent / Received"
                hint="This field is required"
                persistent-hint
                :items="stav_posty"
                item-title="nazov"
                item-value="id"
                :rules="[rules.required]"
                :readonly="isReadOnly"
                @update:modelValue="(val) => updateStavField('status', val)"
              ></v-select>
            </v-col>

            <v-col cols="12" lg="2" md="2" sm="6">
              <v-text-field
                v-model.number="childForm.year"
                type="number"
                label="Year"
                maxlength="4"
                hint="This field is required"
                persistent-hint
                :rules="[rules.required]"
                :readonly="isReadOnly"
                @input="updateField('year', $event.target.value)"
              ></v-text-field>
            </v-col>

            <v-col cols="12" lg="2" md="2" sm="6">
              <v-text-field
                v-model.number="childForm.int_number"
                type="number"
                label="Internal number"
                maxlength="255"
                persistent-hint
                :readonly="isReadOnly"
                @input="updateField('int_number', $event.target.value)"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="5" md="5" sm="6">
              <v-text-field
                v-model="childForm.addressee"
                label="Addressee"
                maxlength="255"
                persistent-hint
                hint="This field is required"
                :rules="[rules.required]"
                :readonly="isReadOnly"
                @input="updateField('addressee', $event.target.value)"
              ></v-text-field>
            </v-col>

            <!-- <v-col cols="12" lg="3" md="3" sm="6">
              <span>Dátum odoslania / prijatia</span>
              <v-date-picker
                v-model="childForm.datum"
                @input="updateField('date', $event.target.value)"
                @update:modelValue="(val) => updateField('date', val)"
              />
            </v-col> -->

            <v-col cols="12" lg="3" md="3" sm="6">
              <v-combobox
                v-model="childForm.type"
                label="Shipment type"
                :items="druh_zasielky"
                maxlength="255"
                :readonly="isReadOnly"
                @update:modelValue="(val) => updateField('type', val)"
                @input="updateField('type', $event.target.value)"
              ></v-combobox>
            </v-col>

            <!-- <v-col cols="12" lg="3" md="3" sm="6">
              <v-select
                v-model.number="childForm.employee_id"
                label="Employee"
                :items="selectUsers"
                :readonly="isReadOnly"
                @update:modelValue="(val) => updateField('employee_id', val)"
              ></v-select>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="childForm.content"
                label="Content"
                rows="2"
                auto-grow
                counter
                maxlength="1000"
                variant="outlined"
                :readonly="isReadOnly"
                @input="updateField('content', $event.target.value)"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-form>
</template>
​
<script>
export default {
  props: {
    editFormData: { type: Object },
    isReadOnly: { type: Boolean, default: false },
    updateEditedItem: {
      type: Function,
      required: true,
    },
  },
  emits: ['on-submit', 'on-close'],
  data() {
    return {
      localFormData: {},
      childForm: {
        year: this.editFormData?.year || new Date().getFullYear(),
        status: this.editFormData?.status,
        int_number: this.editFormData?.int_number,
        date: this.editFormData?.date,
        addressee: this.editFormData?.addressee,
        content: this.editFormData?.content,
        type: this.editFormData?.type,
        employee_id: this.editFormData?.employee_id,
      },
      rules: {
        required: (value) => !!value || 'This field is required.',
      },
      stav_posty: [
        { nazov: 'Sent', id: 1 },
        { nazov: 'Received', id: 2 },
      ],
      druh_zasielky: [
        'Economy',
        'Expedited',
        'Flat-rate',
        'International',
        'Priority',
      ],
      selectUsers: { login: 'employee1', value: 1 },
      nextIntCislo: 100,
    };
  },
  computed: {
    formTitle() {
      if (this.editedIndex === -2) {
        return `Show entry`;
      } else {
        return this.editedIndex === -1 ? 'New entry' : 'Edit record';
      }
    },
  },

  watch: {
    editFormData: {
      handler(newVal) {
        this.localFormData = {
          ...newVal,
        };
      },
      immediate: true,
    },
  },
  methods: {
    updateField(field, value) {
      if (field === 'status' || field === 'employee_id' || field === 'year') {
        value = value ? Number(value) : 999;
      }
      if (field === 'date') {
        value = value ? new Date(value) : null;
      }

      this.updateEditedItem(field, value);
    },
    async validate() {
      if (this.$refs.form) {
        const { valid } = await this.$refs.form.validate();
        return valid;
      }
      return false;
    },
    async updateStavField(field, value) {
      this.updateField(field, value);

      this.childForm.int_number = this.nextIntCislo + 1;
      this.updateField('int_number', this.childForm.int_number);
    },
  },
};
</script>
