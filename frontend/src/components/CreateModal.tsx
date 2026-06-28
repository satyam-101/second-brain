type CreateModalProps = {
    form:{
        title:string,
        content:string,
        tags:string,
        link:string;
    };
    setForm:React.Dispatch<
        React.SetStateAction<{
            title:string,
        content:string,
        tags:string,
        link:string;
        }>
    >;
    creating:boolean;
    onClose:()=> void;
    OnClick:()=>void;
}

const CreateModal = ({
    form,setForm,onClose,OnClick,creating
}:CreateModalProps) => {
  return (
   <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4'>
          <div className='bg-white w-[92%] sm:w-[85%] md:w-[70%] lg:w-[55%] xl:w-[45%] max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold'>Create Note</h2>
              <button onClick={onClose}>X</button>
            </div>
            <input type="text"
              placeholder='title'
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })
              } className="w-full border rounded-lg px-4 py-3 mb-3"
            /> <br />
            <input type="text"
              placeholder='content'
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              className="w-full border rounded-xl px-5 py-4 mb-4 min-h-[180px] resize-none"
            /> <br />
            <input type="text"
              placeholder='tags'
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 mb-3"
            /> <br />
            <input type="text"
              placeholder='link'
              value={form.link}
              onChange={e => setForm({ ...form, link: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 mb-3"
            /> <br />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 border rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
                className="bg-black text-white px-5 py-3 rounded-lg"
                onClick={OnClick}
              >
                {creating ? "Creating..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>
  )
}

export default CreateModal