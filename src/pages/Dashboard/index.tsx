import { useEffect, useState } from "react";

import { Header } from "../../components/Header";
import { Food } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";

import api from "../../services/api";

import { FoodsContainer } from "./styles";

interface ApiFood {
  available: boolean;
  id: number;
  image: string;
  name: string;
  description: string;
  price: string;
}

interface AddFood {
  image: string;
  name: string;
  description: string;
  price: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<ApiFood[]>([]);
  const [editingFood, setEditingFood] = useState<ApiFood>({} as ApiFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function getFood() {
      const res = await api.get("/foods");
      const data = res.data;
      setFoods(data);
    }
    getFood();
  }, []);

  async function handleAddFood(food: AddFood): Promise<void> {
    try {
      const res = await api.post("/foods", {
        ...food,
        available: true,
      });
      setFoods((previousFoods) => [...previousFoods, res.data]);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateFood(food: AddFood) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: ApiFood) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
