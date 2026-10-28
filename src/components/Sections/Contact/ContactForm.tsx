import {FC, memo, useCallback, useMemo, useState} from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: FC = memo(() => {
  const defaultData = useMemo(
    () => ({
      name: '',
      email: '',
      message: '',
    }),
    [],
  );

  const [data, setData] = useState<FormData>(defaultData);

  const onChange = useCallback(
    <T extends HTMLInputElement | HTMLTextAreaElement>(event: React.ChangeEvent<T>): void => {
      const {name, value} = event.target;

      const fieldData: Partial<FormData> = {[name]: value};

      setData({...data, ...fieldData});
    },
    [data],
  );

  const handleSendMessage = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      /**
       * This is a good starting point to wire up your form submission logic
       * */
      console.log('Data to send: ', data);
    },
    [data],
  );

  const inputClasses = 'field-input w-full px-4 py-3 text-sm text-slate-200 placeholder:text-smoke-500';

  return (
    <form className="flex h-full flex-col gap-y-4" method="POST" onSubmit={handleSendMessage}>
      <div>
        <h3 className="font-display text-lg font-semibold text-slate-100">Send a message</h3>
        <p className="mt-1 text-sm text-slate-400">
          The form is a starting point — the fields below are ready to wire up.
        </p>
      </div>

      <input className={inputClasses} name="name" onChange={onChange} placeholder="Name" required type="text" />
      <input
        autoComplete="email"
        className={inputClasses}
        name="email"
        onChange={onChange}
        placeholder="Email"
        required
        type="email"
      />
      <textarea
        className={`${inputClasses} min-h-[160px] flex-1 resize-y`}
        maxLength={250}
        name="message"
        onChange={onChange}
        placeholder="Message"
        required
        rows={6}
      />
      <div className="mt-2 flex items-center gap-4">
        <button
          aria-label="Submit contact form"
          className="rounded-full bg-lime px-7 py-3 text-sm font-semibold text-ink-950 shadow-glow transition-all duration-300 hover:bg-lime-bright hover:shadow-glow-lg active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-lime motion-reduce:transition-none motion-reduce:active:scale-100"
          type="submit">
          Send Message
        </button>
      </div>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';
export default ContactForm;
