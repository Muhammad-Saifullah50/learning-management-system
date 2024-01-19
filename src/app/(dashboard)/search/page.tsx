import { getCategories } from "@/actions/category.action"
import Categories from "@/components/Categories";
import SearchInput from "@/components/SearchInput";

const SearchPage = async () => {

  const categories = await getCategories();
  return (
    <>
      <div className="p-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories
          items={categories}
        />
      </div>
    </>)
}

export default SearchPage
