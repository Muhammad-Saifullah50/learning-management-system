import { getCategories } from "@/actions/category.action"
import Categories from "@/components/Categories";

const SearchPage = async () => {

  const categories = await getCategories();
  return (
    <div className="p-6">
      <Categories
        items={categories}
      />
    </div>
  )
}

export default SearchPage
