import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../Styles/ProfilePage.module.css';

interface FormData {
  title: string;
  description: string;
  date: string;
}

interface EventFormProps {
  isModalOpen: boolean;
  isEditMode: boolean;
  closeModal: () => void;
  handleSave: (data: FormData) => void;
  initialData?: FormData;
}

const EventForm: React.FC<EventFormProps> = ({
  isModalOpen,
  isEditMode,
  closeModal,
  handleSave,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: initialData,
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    handleSave(data);
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{isEditMode ? 'Редактирование мероприятия' : 'Добавление мероприятия'}</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Название:
            <input
              type="text"
              {...register('title', {
                required: 'Название обязательно',
                maxLength: { value: 100, message: 'Максимум 100 символов' },
                minLength: { value: 3, message: 'Минимум 3 символа' },
              })}
            />
            {errors.title && <p className={styles.errorText}>{errors.title.message}</p>}
          </label>

          <label>
            Описание:
            <textarea
              {...register('description', {
                required: 'Описание обязательно',
                maxLength: { value: 500, message: 'Максимум 500 символов' },
                minLength: { value: 5, message: 'Минимум 5 символов' },
              })}
              rows={4}
            />
            {errors.description && <p className={styles.errorText}>{errors.description.message}</p>}
          </label>

          <label>
            Дата:
            <input
              type="date"
              {...register('date', {
                required: 'Дата обязательна',
              })}
              min={new Date().toISOString().slice(0, 10)}
            />
            {errors.date && <p className={styles.errorText}>{errors.date.message}</p>}
          </label>

          <div className={styles.modalButtons}>
            <button type="button" onClick={closeModal} className={styles.cancelButton}>
              Отмена
            </button>
            <button type="submit" className={styles.saveButton}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;